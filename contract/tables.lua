AUTHORS = [[
  CREATE TABLE IF NOT EXISTS Authors (
    PID TEXT PRIMARY KEY,
    Name TEXT
  );
]]

POSTS = [[
  CREATE TABLE IF NOT EXISTS Posts (
    ID TEXT PRIMARY KEY,
    PID TEXT,
    Title TEXT,
    Body TEXT,
    FOREIGN KEY (PID) REFERENCES Authors(PID)
  );
]]
function InitDb() 
  db:exec(AUTHORS)
  db:exec(POSTS)
  return dbAdmin:tables()
end

return InitDb()

