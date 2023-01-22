/* 路由处理函数模块 */

/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
//导入数据库操作模块
const db = require("../db/index");
// 导入 bcryptjs 这个包
const bcrypt = require("bcryptjs");

////////////////////////
/* 这里需要✅四项任务:
1. 检测表单数据是否合法
2. 检测用户名是否被占用
3. 对密码进行加密处理
4. 插入新用户 */

//注册有新用户的处理函数
exports.regUser = (req, res) => {
  //1. 接收表单数据-获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  console.log(userinfo);
  /////////对表单中的数据,进行合法性校验
  if (!userinfo.username || !userinfo.password) {
    return res.encap("用户名或密码不能为空！");
    // res.send("regUser successfully registered");
  }

  /////////检测用户名是否被占用;
  //定义检测用户名是否被占用sql语句
  const sqlString01 = `select * from ev_users where username=?`;

  //execute sqlString01,并根据结果判断用户名是否被占用
  db.query(sqlString01, userinfo.username, (err, results) => {
    // 判断 执行 SQL 语句失败
    if (err) {
      //return res.send({ status: 1, message: err.message });
      return res.encap(err);
    }
    // 用户名被占用
    if (results.length > 0) {
      // return res.send({
      //   status: 1,
      //   message: "用户名被占用，请更换其他用户名！",
      // });
      return res.encap("用户名被占用，请更换其他用户名！");
    }
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    /////////定义插入新用户的 SQL 语句
    const sqlString02 = "insert into ev_users set ?";

    //execute sqlString02,并根据结果判断新用户是否注册成功
    db.query(
      sqlString02,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
          //return res.send({ status: 1, message: err.message });
          return res.encap(err);
        }
        // SQL 语句执行成功，但影响行数不为 1
        if (results.affectedRows !== 1) {
          // return res.send({ status: 1, message: "注册用户失败，请稍后再试！" });
          return res.encap(err);
        }
        // 注册成功
        return res.encap("注册成功", 0);
      }
    );
  });
};

//////////////////////////////////////////////////////

//登录的处理函数
/* 实现步骤✅
1. 检测表单数据是否合法
2. 根据用户名查询用户的数据
3. 判断用户输入的密码是否正确(匹配用户输入的密码)
4. 生成 JWT 的 Token 字符串 */
exports.login = (req, res) => {
  //接收表单数据
  const userinfo = req.body;
  //console.log(userinfo);
  //res.send("login successfully registered");
  //定义SQL语句
  const sql = `select * from ev_users where username=?`;
  // 执行 SQL 语句，根据用户名查询用户的信息

  db.query(sql, userinfo.username, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.encap(err);
    // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
    if (results.length !== 1) return res.encap("登录失败！");
    //TODO : 判断密码是否正确
    // TODO：在服务器端生成 Token 的字符串
    //登录逻辑流程：SQL语句是否执行成功 -> 用户名是否存在 -> 密码是否正确 -> 处理token中的信息对象，生成密钥 -> 生成token -> 响应客户端
    // 剔除完之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
  });
};
