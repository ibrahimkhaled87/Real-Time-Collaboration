import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async(req, res) => {
    console.log("POST login called");
    console.log(req.body);
    const {username, password} = req.body;

    //Does user exist in db?
    const data = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if(data.rows.length === 0)
        return res.status(400).json({error: "User not found"})

    //Is password correct?
    const validPassword = await bcrypt.compare(password, data.rows[0].password);
    if(!validPassword)
        return res.status(400).json({error: "Invalid password"});

    const token = jwt.sign(
        { username: data.rows[0].username,
           full_name: data.rows[0].full_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({token});
}

export const signup = async(req, res) => {
    console.log("POST signup called");
    console.log(req.body);
    const {full_name, username, password, confirm_password} = req.body;

    //Does user exist in db?
    let data = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if(data.rows.length === 1)
        return res.status(400).json({message: "Username exists"})

    //Is password same as confirm?
    const confirmedPassword = password === confirm_password;
    if(!confirmedPassword)
        return res.status(400).json({message: "Passwords do not match"});

    //Add user
    const hashedPassword = await bcrypt.hash(password, 10);
    data = await db.query("INSERT INTO users(full_name, username, password) VALUES($1, $2, $3) RETURNING *", [full_name, username, hashedPassword]);

    const token = jwt.sign(
        { username: data.rows[0].username,
            full_name: data.rows[0].full_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({token});
}