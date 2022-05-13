
const CHECK_PERMISSION = `
SELECT * 
FROM users_permissions
WHERE user_id = $1 AND user_modul = $2
`
const UPDATE_PERMISSION = `
UPDATE users_permissions
SET user_update = $3  
WHERE user_id = $1 AND user_modul = $2
RETURNING user_update
`

const CREATE_PERMISSION = `
UPDATE users_permissions
SET user_create = $3  
WHERE user_id = $1 AND user_modul = $2
RETURNING user_create
`

const READ_PERMISSION = `
UPDATE users_permissions
SET user_read = $3  
WHERE user_id = $1 AND user_modul = $2
RETURNING user_read
`

const DELETE_PERMISSION = `
UPDATE users_permissions
SET user_delete = $3  
WHERE user_id = $1 AND user_modul = $2
RETURNING user_delete
`

const OWN_PERMISSION = `
SELECT 
    u.user_id as userid,
    u.user_name as username,
    p.user_modul as modul,
    p.user_create as create,
    p.user_read as read,
    p.user_update as update,
    p.user_delete as delete
FROM users u
INNER JOIN users_permissions p ON u.user_id = p.user_id
WHERE u.user_id = $1
`

const ALL_PERMISSION = `
SELECT 
    u.user_id as userid,
    u.user_name as username,
    p.user_modul as modul,
    p.user_create as create,
    p.user_read as read,
    p.user_update as update,
    p.user_delete as delete
FROM users u
INNER JOIN users_permissions p ON u.user_id = p.user_id
`

export default {
    ALL_PERMISSION,
    OWN_PERMISSION,
    CHECK_PERMISSION,
    CREATE_PERMISSION,
    READ_PERMISSION,
    DELETE_PERMISSION,
    UPDATE_PERMISSION
}