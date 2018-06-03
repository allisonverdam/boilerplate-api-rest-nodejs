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
    userName: {
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
          msg: "Email inválido."
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
        if (val != '' && val != null) {
          this.setDataValue('password', bcrypt.hashSync(val))
        }
      }
    },
    role: {
      type: DataType.INTEGER,
      defaultValue: 0
    }
  })

  User.authenticate = (login) => {
    return User.getUserByUserName(login)
      .then(result => result ? result : User.getUserByEmail(login));
  };

  User.getUserByUserName = (userName) => {
    return User.find({
      where: {
        userName: userName
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
      userName: body.userName,
      email: body.email,
      password: body.password,
    })
  }

  return User;
}
