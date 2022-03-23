import bcrypt from "bcryptjs";
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', 10),
        isAdmin: true
    },
    {
        name: 'Arshid',
        email: 'arshid@example.com',
        password: bcrypt.hashSync('arshid123', 10)
    },
    {
        name: 'Arshana',
        email: 'arshana@example.com',
        password: bcrypt.hashSync('arshana123', 10)
    }
]

export default users;