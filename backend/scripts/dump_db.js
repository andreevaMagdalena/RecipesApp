const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
(async ()=>{
  const args = process.argv.slice(2);
  if (args.length===0){
    console.error('Usage: node dump_db.js <path-to-db>');
    process.exit(1);
  }
  const dbPath = path.resolve(args[0]);
  if (!fs.existsSync(dbPath)){
    console.error('File not found:', dbPath);
    process.exit(1);
  }
  const buf = fs.readFileSync(dbPath);
  const SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file)
  });
  const db = new SQL.Database(buf);
  const master = db.exec("SELECT name, type, sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY type,name;");
  const items = [];
  if (master.length){
    const rowset = master[0];
    for (const v of rowset.values){
      items.push({name: v[0], type: v[1], sql: v[2]});
    }
  }
  const out = {db: dbPath, tables: []};
  for (const it of items.filter(i=>i.type==='table')){
    const tname = it.name;
    try{
      const pragma = db.exec(`PRAGMA table_info("${tname}");`);
      const columns = pragma.length ? pragma[0].values.map(r=>({cid:r[0],name:r[1],type:r[2],notnull:r[3],dflt_value:r[4],pk:r[5]})) : [];
      const rowsRes = db.exec(`SELECT * FROM "${tname}" LIMIT 20;`);
      let rows = [];
      if (rowsRes.length){
        const r = rowsRes[0];
        rows = r.values.map(vals=>{
          const obj = {};
          for (let i=0;i<r.columns.length;i++) obj[r.columns[i]] = vals[i];
          return obj;
        });
      }
      out.tables.push({name: tname, columns, rows});
    }catch(err){
      out.tables.push({name: tname, error: String(err)});
    }
  }
  console.log(JSON.stringify(out,null,2));
})().catch(e=>{console.error(e); process.exit(1);});
