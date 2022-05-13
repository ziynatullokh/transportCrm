const CHECK_BRANCH = `
SELECT
    b.branch_name ,
    b.branch_id
FROM users u 
INNER JOIN branches b ON b.branch_id = u.user_branch 
WHERE u.user_id = $1`

const CHECK_BRANCH_ADRESS = `
SELECT
    branch_name ,
    branch_id
FROM branches 
WHERE branch_name = $1`

const CHECK_PERMISSION = `
SELECT * 
FROM users_permissions
WHERE user_id = $1 AND user_modul = $2
`

const ADD_TRANSPORT = `
INSERT INTO transports (staff_id,transport_branch,transport_model,transport_color,transport_img) VALUES ($1,$2,$3,$4,$5)
returning *
`
const GET_TRANSPORT = `
SELECT 
t.transport_id,
u.user_name as staff,
m.model_name as model,
c.color_name as color,
b.branch_name as branch,
t.transport_img
FROM transports t
INNER JOIN users u ON u.user_id = t.staff_id
INNER JOIN transport_models m ON m.model_id = t.transport_model
INNER JOIN transport_colors c ON c.color_id = t.transport_color
INNER JOIN branches b ON b.branch_id = t.transport_branch
WHERE transport_id = $1
`

const GET_TRANSPORT_ALL = `
SELECT 
t.transport_id,
u.user_name as staff,
m.model_name as model,
c.color_name as color,
b.branch_name as branch,
t.transport_img
FROM transports t
INNER JOIN users u ON u.user_id = t.staff_id
INNER JOIN transport_models m ON m.model_id = t.transport_model
INNER JOIN transport_colors c ON c.color_id = t.transport_color
INNER JOIN branches b ON b.branch_id = t.transport_branch

where 
    u.user_name ilike concat('%', $3::varchar, '%') or
    c.color_name ilike concat('%', $3::varchar, '%') or
    b.branch_name ilike concat('%', $3::varchar, '%') or
    m.model_name ilike concat('%', $3::varchar, '%')
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

const CHANGE_CAR_BRANCH = `
UPDATE transports
SET transport_branch = $2
WHERE transport_id = $1
returning transport_id
`

const CHANGE_CAR_COLOR = `
UPDATE transports
SET transport_color = $2
WHERE transport_id = $1
returning transport_id
`

const CHANGE_CAR_IMG = `
UPDATE transports
SET transport_img = $2
WHERE transport_id = $1
returning transport_id
`

const DELETE_TRANSPORT = `
DELETE from transports WHERE transport_id = $1 returning transport_id
`

const STAFF_TRANSPORTS = `
SELECT 
t.transport_id,
u.user_name as staff,
m.model_name as model,
c.color_name as color,
b.branch_name as branch,
t.transport_img
FROM transports t
INNER JOIN users u ON u.user_id = t.staff_id
INNER JOIN transport_models m ON m.model_id = t.transport_model
INNER JOIN transport_colors c ON c.color_id = t.transport_color
INNER JOIN branches b ON b.branch_id = t.transport_branch

where 
    t.transport_branch = $6 AND 
    u.user_name ilike concat('%', $3::varchar, '%') or
    c.color_name ilike concat('%', $3::varchar, '%') or
    b.branch_name ilike concat('%', $3::varchar, '%') or
    m.model_name ilike concat('%', $3::varchar, '%')
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


export default {
    STAFF_TRANSPORTS,
    DELETE_TRANSPORT,
    CHANGE_CAR_COLOR,
    CHANGE_CAR_IMG,
    CHECK_BRANCH_ADRESS,
    CHANGE_CAR_BRANCH,
    GET_TRANSPORT_ALL,
    GET_TRANSPORT,
    CHECK_BRANCH,
    CHECK_PERMISSION,
    ADD_TRANSPORT
}

