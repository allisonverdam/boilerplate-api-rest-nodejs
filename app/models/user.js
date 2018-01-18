import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataType) => {
    const User = sequelize.define('user', {
        firstName: {
            allowNull: false,
            type: DataType.STRING,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            allowNull: false,
            type: DataType.STRING,
            validate: {
                notEmpty: true
            }
        },
        login: {
            allowNull: false,
            unique: true,
            type: DataType.STRING,
            validate: {
                notEmpty: true
            }
        },
        email: {
            allowNull: false,
            unique: true,
            type: DataType.STRING,
            validate: {
                notEmpty: true,
                isEmail: {
                    msg: "invalid email."
                }
            }
        },
        password: {
            allowNull: false,
            type: DataType.STRING,
            validate: {
                notEmpty: true
            },
            set(val) {
                if (val != '' && val != null)
                    this.setDataValue('password', bcrypt.hashSync(val))
            }
        },
        role: {
            type: DataType.INTEGER,
            defaultValue: 0
        }
    })

    User.authenticate = (login) => {
        return User.getUserByLogin(login)
            .then(result => result, () => {
                return User.getUserByEmail(login)
            })

    }

    User.getUserByLogin = (login) => {
        return User.find({
            where: {
                login: login
            }
        })
    }

    User.getUserByEmail = (email) => {
        return User.find({
            where: {
                email: email
            }
        })
    }

    User.createUser = (body) => {
        return User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            login: body.login,
            email: body.email,
            password: body.password,
        })
    }

    return User;
}