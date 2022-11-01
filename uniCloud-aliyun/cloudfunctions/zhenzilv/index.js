'use strict';
const jwt = require('jsonwebtoken')
let appid = 'wx3bf6beb9a1aa1755'
let appSecret = '3cc1505619d33415399ae06a425ac254'
let jwtSecret = 'jpruby'
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)

  /**
   * 用户登录或者注册，如果没有注册过，就去注册并返回token,如果注册过了直接返回用户信息和token
   */
  if (event.api === 'userlogin') {
    const loginInfo = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${event.code}&grant_type=authorization_code`, {
        dataType: 'json'
      })

    const userId = loginInfo.data.openid //成功拿到用户openid
    const token = `Bearer ` + jwt.sign({
      userId
    }, jwtSecret) //通过jwtwebtoken生成携带userId的token
    // 用户登录前先查询一下是否存在这个用户,如果用户不存在再像后台增加用户
    const isUserExist = await db.collection('sys_user').doc(userId).get()
    console.log(isUserExist);
    if (isUserExist.data[0]) { //说明用户已经存在返回用户信息和token
      //返回数据给客户端
      return {
        user: isUserExist.data[0],
        token
      }
    } else {
      // 去数据添加一条user信息
      const data = {
        _id: userId,
        nickname: event.nickname || '',
        avatar: event.avatar || '',
        createTime: Date.now(),
      }
      await db.collection('sys_user').add(data)
      //返回数据给客户端
      return {
        user: data,
        token
      }
    }

  }

  if (event.api === 'getUserFromCloud') {
    const loginInfo = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${event.code}&grant_type=authorization_code`, {
        dataType: 'json'
      })

    const userId = loginInfo.data.openid //成功拿到用户openid
    const token = `Bearer ` + jwt.sign({
      userId
    }, jwtSecret) //通过jwtwebtoken生成携带userId的token

    const res = await db.collection('sys_user').doc(userId).get() //查找用户是否存在 并返回结果
    if (res.data[0]) { //说明用户已经存在返回用户信息和token
      //返回数据给客户端
      return {
        user: res.data[0],
        token,
      }
    } else {
      return
    }

  };

  if (event.api === 'createOpinion') {
    return await db.collection('opinions').add(event.data)
  }

  if (event.api === 'createRecords') {
    const {
      openid,
      add
    } = event.data


    const res = await db.collection('records').where({
      'openid': openid
    }).orderBy('createTime', 'desc').get()


    if (res.data[0]) {
      var mark = res.data[0].mark
    } else {
      var mark = 0
    }
    mark = mark + add
    await db.collection('records').add({
      openid,
      add,
      mark,
      createTime: Date.now()
    })
    return {
      code: 0,
      msg: 'success'
    }
    // return mark
    // return await db.collection('records').add(event.data)
  }

  if (event.api === 'getCurrentMark') {
    const {
      openid
    } = event.data
    try {
      const res = await db.collection('records').where({
        'openid': openid
      }).orderBy('createTime', 'desc').get()

      if (res.data[0]) {
        var mark = res.data[0].mark
      } else {
        var mark = 0
      }

      return {
        code: 0,
        msg: 'success',
        mark: mark
      }
    } catch (e) {
      //TODO handle the exception
      return {
        code: -1,
        msg: "添加失败" + e
      }
    }
  }

  if (event.api === 'resetMark') {
    const {
      openid,
    } = event.data
    const data = {
      openid: openid,
      mark: 0,
      add: 0,
      node: '清零',
      createTime: Date.now()
    }
    try {
      await db.collection('records').add(data)

      return {
        code: 0,
        msg: 'success',
      }
    } catch (e) {
      //TODO handle the exception
      return {
        code: -1,
        msg: "清零失败" + e
      }
    }
  }

  if (event.api === 'deleteRecord') {
    const {
      openid,
    } = event.data

    try {
      const res = await db.collection('records').where({
        'openid': openid
      }).orderBy('createTime', 'desc').limit(1).get()
      // return {
      //   hehe: res.data[0]
      // }
      if (res.data[0]) {
        await db.collection('records').where({
          '_id': res.data[0]._id
        }).remove()
        const re_res = await db.collection('records').where({
          'openid': openid
        }).orderBy('createTime', 'desc').limit(1).get()
        if (re_res.data[0].mark) {
          var mark = re_res.data[0].mark
        } else {
          var mark = 0
        }
      } else {
        var mark = 0
      }
      return {
        code: 0,
        msg: 'success',
        mark: mark
      }
    } catch (e) {
      //TODO handle the exception
      return {
        code: -1,
        msg: "清零失败" + e
      }
    }
  }

  if (event.api === 'getRecords') {
    const {
      openid,
      _currentPage,
      _pageSize
    } = event.data

    //前端调用此函数需要传入的参数：dbName ，filter ，pageIndex ，pageSize
    var currentPage = _currentPage ? _currentPage : 1; //当前第几页，默认为第一页
    var pageSize = _pageSize ? _pageSize : 15; //每页取多少条记录，默认为15条  

    const countResult = await db.collection('records').where({
      'openid': openid
    }).count() //获取集合中的总记录数
    const total = countResult.total //得到总记录数 
    const totalPage = Math.ceil(total / pageSize) //计算页数

    var hasMore; //提示前端是否还有数据
    if (currentPage > totalPage || currentPage == totalPage) { //如果没有数据了，就返回false
      hasMore = false
    } else {
      hasMore = true
    }

    //查询数据并返回给前端
    return db.collection('records')
      .where({
        'openid': openid
      })
      .orderBy('createTime', 'desc')
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .get()
      .then(res => {
        res.hasMore = hasMore;
        return res; // 返回json给客户端
      })

  }

  if (event.api === 'updateNode') {
    const {
      _id,
      node
    } = event.data

    try {
      await db.collection('records').doc(_id).update({
        node: node
      })
      return {
        code: 0,
        msg: "success"
      }
    } catch (e) {
      //TODO handle the exception
      return {
        code: -1,
        data: {
          msg: "修改失败" + e
        }
      }
    }


  }

}
