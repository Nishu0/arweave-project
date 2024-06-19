AUTHORS_DROP = [[
  DROP TABLE IF EXISTS Authors;
]]
POSTS_DROP = [[
  DROP TABLE IF EXISTS Posts;
]]
COMMENTS_DROP = [[
  DROP TABLE IF EXISTS Comments;
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
    Likes INTEGER DEFAULT 0,
    Dislikes INTEGER DEFAULT 0,
    FOREIGN KEY (PID) REFERENCES Authors(PID)
  );
]]

COMMENTS = [[
  CREATE TABLE IF NOT EXISTS Comments (
    CommentID TEXT PRIMARY KEY,
    PostID TEXT,
    Comment TEXT,
    Highlighted BOOLEAN DEFAULT 0,
    FOREIGN KEY (PostID) REFERENCES Posts(ID)
  );  
]]
function InitDb()
  dbAdmin:exec(AUTHORS_DROP)
  dbAdmin:exec(POSTS_DROP) 
  dbAdmin:exec(COMMENTS_DROP)
  db:exec(AUTHORS)
  db:exec(POSTS)
  db:exec(COMMENTS)
  return dbAdmin:tables()
end

return InitDb()

