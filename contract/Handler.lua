-- Handler for registering a user
Handlers.add("ArweaveQuery.Register",
  function (msg)
    return msg.Action == "Register-User"
  end,
  function (msg)
    -- Check if author is already registered
    local authorCount = #dbAdmin:exec(
      string.format([[SELECT * FROM Authors WHERE PID = "%s";]], msg.From)
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

-- Handler to list all registered authors
Handlers.add("ArweaveQuery.Authors",
  function (msg)
    return msg.Action == "AuthorList"
  end,
  function (msg)
    local authors = dbAdmin:exec([[SELECT * FROM Authors;]])
    Send({Target = msg.From, Action = "ArweaveQuery.Authors", Data = require('json').encode(authors)})
    print("Listing " .. #authors .. " authors")
  end
)

-- Handler to create a new post
Handlers.add("ArweaveQuery.Post", 
  function (msg) 
    return msg.Action == "Create-Post"
  end,
  function (msg) 
    -- Retrieve author details
    local author = dbAdmin:exec(string.format([[
      SELECT PID, Name FROM Authors WHERE PID = "%s";
    ]], msg.From))[1] 
    
    if author then
      print("Author found:", author)
      
      -- Insert the new post
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

-- Handler to list all posts
Handlers.add("ArweaveQuery.Posts", 
  function (msg)
    return msg.Action == "List"
  end,
  function (msg)
    local posts = dbAdmin:exec([[
      SELECT p.ID, p.Title, p.Discord, p.Body, a.Name AS "Author" FROM Posts p LEFT OUTER JOIN Authors a ON p.PID = a.PID;
    ]])
    
    print("Listing " .. #posts .. " posts")
    Send({Target = msg.From, Action = "ArweaveQuery.Posts", Data = require('json').encode(posts)})
  end
)

-- Handler to get a specific post by ID
Handlers.add("ArweaveQuery.Get",
  function (msg) 
    return msg.Action == "Get-Post"
  end,
  function (msg) 
    local post = dbAdmin:exec(string.format([[
      SELECT p.ID, p.Title, p.Discord, a.Name AS "Author", p.Body, p.Error, p.Code, p.Likes, p.Dislikes 
      FROM Posts p 
      LEFT OUTER JOIN Authors a ON p.PID = a.PID 
      WHERE p.ID = "%s";
    ]], msg['Post-Id']))
    
    Send({Target = msg.From, Action = "Get-Response", Data = require('json').encode(post)})
    print(post)
  end
)

-- Handler to like a post
Handlers.add("ArweaveQuery.LikePost",
  function (msg)
    return msg.Action == "Like-Post"
  end,
  function (msg)
    dbAdmin:exec(string.format([[
      UPDATE Posts SET Likes = Likes + 1 WHERE ID = "%s";
    ]], msg['Post-Id']))
    
    Send({Target = msg.From, Action = "Liked-Post", Data = "Post Liked."})
    print("Post Liked:", msg['Post-Id'])
  end
)

-- Handler to dislike a post
Handlers.add("ArweaveQuery.DislikePost",
  function (msg)
    return msg.Action == "Dislike-Post"
  end,
  function (msg)
    dbAdmin:exec(string.format([[
      UPDATE Posts SET Dislikes = Dislikes + 1 WHERE ID = "%s";
    ]], msg['Post-Id']))
    
    Send({Target = msg.From, Action = "Disliked-Post", Data = "Post Disliked."})
    print("Post Disliked:", msg['Post-Id'])
  end
)

-- Handler to list all comments for a specific post
-- Handler to get comments for a specific post
Handlers.add("ArweaveQuery.GetComments",
  function (msg) 
    return msg.Action == "GetComments"
  end,
  function (msg) 
    local comment = dbAdmin:exec(string.format([[
      SELECT c.CommentID, c.Comment, c.Highlighted 
      FROM Comments c 
      WHERE c.PostID = "%s";
    ]], msg['Post-Id']))
    
    Send({Target = msg.From, Action = "Get-Comment", Data = require('json').encode(comment)})
    print(comment)
  end
)

-- Handler to add a comment to a specific post
Handlers.add("ArweaveQuery.AddComment",
  function (msg)
    return msg.Action == "Add-Comment"
  end,
  function (msg)
    dbAdmin:exec(string.format([[
      INSERT INTO Comments (CommentID, PostID, Comment, Highlighted) VALUES ("%s", "%s", "%s", 0);
    ]], msg.Id, msg['Post-Id'], msg.Comment))
    
    Send({Target = msg.From, Action = "Comment-Added", Data = "Comment Added."})
    print("Comment Added to Post:", msg['Post-Id'])
  end
)

-- Handler to highlight a comment on a specific post by the post owner
Handlers.add("ArweaveQuery.HighlightComment",
  function (msg)
    return msg.Action == "Highlight-Comment"
  end,
  function (msg)
    -- Check if the post owner is trying to highlight the comment
    local isPostOwner = #dbAdmin:exec(string.format([[
      SELECT * FROM Posts WHERE ID = "%s" AND PID = "%s";
    ]], msg['Post-Id'], msg.From)) > 0
    
    if isPostOwner then
      dbAdmin:exec(string.format([[
        UPDATE Comments SET Highlighted = 1 WHERE CommentID = "%s" AND PostID = "%s";
      ]], msg['Comment-Id'], msg['Post-Id']))
      
      Send({Target = msg.From, Action = "Comment-Highlighted", Data = "Comment Highlighted."})
      print("Comment Highlighted:", msg['Comment-Id'])
    else
      Send({Target = msg.From, Action = "Error", Data = "You are not the owner of the post."})
      print("Cannot highlight comment: You are not the owner of the post.")
    end
  end
)
