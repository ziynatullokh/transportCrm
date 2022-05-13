const GET_USERS = `
    select 
        user_id as userid,
        user_name as username,
        user_birth_date as birthdate,
        user_gender as gender,
        b.branch_name as branch,
        user_created_time_at as registertime
    from users
    inner join branches b ON b.branch_id = users.user_branch
    where 
        user_name ilike concat('%', $3::varchar, '%') or
        b.branch_name ilike concat('%', $3::varchar, '%')
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then user_created_time_at
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then user_created_time_at
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then user_name
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then user_name
    end asc
    offset $1 limit $2
`

const GET_USER = `
    select 
        user_id as userid,
        user_name as username,
        b.branch_name as branch,
        user_gender as gender,
        user_birth_date as birthdate,
        user_created_time_at as registertime
    from users
    INNER JOIN branches b ON b.branch_id = users.user_branch
    where user_id = $1
`
const CREATE_USER = `
INSERT INTO users (
    user_name,user_password,user_birth_date,user_gender,user_branch
    )
VALUES(
    $1,$2,$3,$4,$5
)
returning user_id
`

const DEFAULT_PERMISSION1 = `
INSERT INTO users_permissions (user_id,user_modul) VALUES ($1, 'transports'),
($1, 'branch'),
($1, 'permission');
`

const CHECK_BRANCH = `
SELECT * 
FROM branches
WHERE branch_name =$1
`

const FIND_USER = `
SELECT * 
FROM users
WHERE user_name = $1
`

const CHECK_PERMISSION = `
SELECT * 
FROM users_permissions
WHERE user_id = $1 AND user_modul = $2
`

export default {
    FIND_USER,
    CHECK_BRANCH,
    CREATE_USER,
    DEFAULT_PERMISSION1,
    CHECK_PERMISSION,
    GET_USERS,
    GET_USER
}