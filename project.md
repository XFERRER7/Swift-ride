

#Entities
  -Client - (create, read, update, delete)
  -Driver - (create, read, update, delete)
  -Vehicle - (create, read, update, delete)
  -displacement - (create, read, update, delete)

#Use Cases
  -Create
  -Delete
  -Update
  -Read

#users
  -Client
  -Admin

#Screens number of screens (9)
  #global
    -flow choice
  #client
    #Register (create - client)
    #Login (read - client)
    #Profile (read - client) - (update - client) - (delete - client)
    #Home [Choose a ride or delivery]
    #Delivery (create - displacement)  - (update - displacement) - (read - displacement) - 
    (read - driver) - (read - vehicle)
    #Get a ride (create - displacement)  - (update - displacement) - (read - displacement) -
    (read - driver) - (read - vehicle)
  #admin
    #Vehicle panel (create - vehicle) - (update - vehicle) - (read - vehicle) - (delete - vehicle)
    #Driver panel (create - driver) - (update - driver) - (read - driver) - (delete - driver)
    #Displacement panel (update - displacement) - (read - displacement) - (delete - displacement)
