AUTHORS_DROP = [[
  DROP TABLE IF EXISTS Authors;
]]
POSTS_DROP = [[
  DROP TABLE IF EXISTS Posts;
]]

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
    Discord TEXT,
    OS TEXT,
    Body TEXT,
    Error TEXT,
    Code TEXT,
    FOREIGN KEY (PID) REFERENCES Authors(PID)
  );
]]
function InitDb()
  dbAdmin:exec(AUTHORS_DROP)
  dbAdmin:exec(POSTS_DROP) 
  db:exec(AUTHORS)
  db:exec(POSTS)
  return dbAdmin:tables()
end

return InitDb()

