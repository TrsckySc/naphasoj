# 如何使用MockJS语法生成随机mock数据

Mock.js 是一个可以生成生成随机数据的js库。本项目可支持下面写法以及其他写法，部分语法不支持(比如正则)，这是由于JSON5数据不支持导致的。

```
// 支持以下两种写法，并且可混用
-----------数据模板定义规范-----------
{
  // 属性 list 的值是一个数组，其中含有 3 个元素
  'list|3': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
  }]
}
// 生成==>
{
  "list": [
    {
      "id": 1
    },
    {
      "id": 2
    },
    {
      "id": 3
    }
  ]
}
-----------数据占位符定义规范-----------
{
  name: "@cname()", // 随机生成一个中文名
  code: "@string()", // 随机生成一串字符串
  id: "@integer()", // 随机生成一个数字
  age: "@integer(10,100)", // 随机生成一个10至100的数字
  avter: "@image('100x100')", // 生成一个100x100的图片
}
// 生成==>
{
  name: "张三",
  code: "sdfafw1212131",
  id: 1231831283121,
  age: 48,
  avter: "http://dummyimage.com/100x100"
}
```

更多用法可访问：[https://github.com/nuysoft/Mock/wiki/Getting-Started](https://github.com/nuysoft/Mock/wiki/Getting-Started)