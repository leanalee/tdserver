# tdserver

## Models

1. Task Model

   - \_id
   - title : string
   - dateCreate : date
   - status : string
   - hrsWorked: number
   <!-- - hrsWorked : {date: number} (obj key = date, val = number) -->
   - hrsNeeded : number
   - dueDate : date
   - scheduled : date
   - goal : modelObject
   - labels : [modelObject]

2. Goal Model

   - \_id
   - name : string
   - dateCreated: date
   - status : string
   - dueDate : date

3. Label Model

   - \_id
   - name

4. User Model

   - \_id
   - name
   - email
   - password
   - preferences
     - color scheme
     - timer settings
     - reminders
     - notifications
