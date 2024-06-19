Handlers.add("ArweaveQuery.Register",
  function (msg)
    return msg.Action == "Register-User"
  end,
  function (msg)
    -- get author count to make sure author is not already registered
    local authorCount = #dbAdmin:exec(
      string.format([[select * from Authors where PID = "%s";]], msg.From)
    )
    if authorCount > 0 then
      Send({Target = msg.From, Action = "Registered", Data = "Already Registered"})
      print("User already registered")
      return "Already Registered"
    end
    local Name = msg.Name or 'user'
    dbAdmin:exec(string.format([[
      INSERT INTO Authors (PID, Name) VALUES ("%s", "%s");
    ]], msg.From, Name))
    Send({
      Target = msg.From,
      Action = "ArweaveQuery.Registered",
      Data = "Successfully Registered."
    })
    print("Registered " .. Name)
  end 
)

Handlers.add("ArweaveQuery.Authors",
  function (msg)
    return msg.Action == "AuthorList"
  end,
  function (msg)
    local authors = dbAdmin:exec([[select * from Authors;]])
    Send({Target = msg.From, Action = "ArweaveQuery.Authors", Data = require('json').encode(authors)})
    print("Listing " .. #authors .. " authors")
  end
)

Handlers.add("ArweaveQuery.Post", 
  function (msg) 
    return msg.Action == "Create-Post"
  end,
  function (msg) 
    -- get user
    local author = dbAdmin:exec(string.format([[
      select PID, Name from Authors where PID = "%s";
    ]], msg.From))[1] 
    
    if author then
      print("Author found:", author)
      
      -- add message
      dbAdmin:exec(string.format([[
        INSERT INTO Posts (ID, PID, Title, Discord, OS, Body, Error, Code) VALUES ("%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s");
      ]], msg.Id, author.PID, msg.Title, msg.Discord, msg.OS, msg.Data, msg.Error, msg.Code))
      Send({Target = msg.From, Data = "Article Posted."})
      print("New Question Posted")
      return "ok"
    else
      Send({Target = msg.From, Data = "Not Registered" })
      print("Author not registered, can't post")
    end
  end
)

Handlers.add("ArweaveQuery.Posts", function (msg)
  return msg.Action == "List"
end,
function (msg)
  local posts = dbAdmin:exec([[
    select p.ID, p.Title, p.Discord, p.Body, a.Name as "Author" from Posts p LEFT OUTER JOIN Authors a ON p.PID = a.PID;
  ]])
  print("Listing " .. #posts .. " posts")
  Send({Target = msg.From, Action = "ArweaveQuery.Posts", Data = require('json').encode(posts)})
end
)

Handlers.add("ArweaveQuery.Get",
function (msg) 
  return msg.Action == "Get"
end,
function (msg) 
  local post = dbAdmin:exec(string.format([[
    SELECT p.ID, p.Title, p.Discord, a.Name as "Author", p.Body, p.Error, p.Code FROM Posts p LEFT OUTER JOIN Authors a ON p.PID = a.PID WHERE p.ID = "%s";
  ]], msg['Post-Id']))
  Send({Target = msg.From, Action = "Get-Response", Data = require('json').encode(post)})
  print(post)
end
)