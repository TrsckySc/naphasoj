$.get('/api/get-prefix-list', function (data) {
  if (data.success) {
    var str = '';
    data.data.forEach(function (prefix) {
      str += '<a class="dropdown-item" href="#" data-value="' + prefix.code + '" onclick="selectedDropdown(this)">' + prefix.code + '</a>'
    })
    $('#interface-prefix-list').append(str);
  }
})

var Random = Mock.Random;

Handlebars.registerHelper('formatMethod', (value) => {
  if (value == 'GET') {
    return 'btn-primary';
  } else {
    return 'btn-success';
  }
})
Handlebars.registerHelper('addOne', (value) => {
  return value + 1;
})
Handlebars.registerHelper('noValue', (value) => {
  if (value) {
    return value;
  } else {
    return '-';
  }
})
var operators = {
  '==': function (l, r) { return l == r; },
  '===': function (l, r) { return l === r; },
  '!=': function (l, r) { return l != r; },
  '!==': function (l, r) { return l !== r; },
  '<': function (l, r) { return l < r; },
  '>': function (l, r) { return l > r; },
  '<=': function (l, r) { return l <= r; },
  '>=': function (l, r) { return l >= r; },
  'typeof': function (l, r) { return typeof l == r; }
};
Handlebars.registerHelper('compare', function (left, operator, right, options) {
  if (arguments.length < 3) {
    throw new Error('Handlerbars Helper "compare" needs 2 parameters');
  }
  if (!operators[operator]) {
    throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
  }
  var result = operators[operator](left, right);
  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

var editor = ace.edit("interface-data");
editor.setTheme("ace/theme/chrome");//设置主题
var JavaScriptMode = ace.require("ace/mode/json").Mode;
editor.session.setMode(new JavaScriptMode());//设置程序语言模式
// 自定义补全列表
var autoCompleteData = [
  {
    name: "mock string",// 没啥用
    value: "@string",// 实际的值
    caption: "@string",// 显示在补全列表中的值
    meta: "Mock-String",// 显示在补全列表中的说明
    type: "local",//好像也没啥用
    score: 1000//评分越高越靠前
  },
  {
    name: "mock number",// 没啥用
    value: "@number",// 实际的值
    caption: "@number",// 显示在补全列表中的值
    meta: "Mock-Number",// 显示在补全列表中的说明
    score: 1000//评分越高越靠前
  },
  {
    name: "mock integer",// 没啥用
    value: "@integer",// 实际的值
    caption: "@integer",// 显示在补全列表中的值
    meta: "Mock-Integer",// 显示在补全列表中的说明
    score: 1000//评分越高越靠前
  },
  {
    name: "mock image",// 没啥用
    value: Random.image('200x100'),// 实际的值
    caption: "@image",// 显示在补全列表中的值
    meta: "Mock-Image",// 显示在补全列表中的说明
    score: 1000//评分越高越靠前
  },
]
// 设置自动补全
var tangideCompleter = {
  identifierRegexps: [/[a-zA-Z_0-9\@\-\u00A2-\uFFFF]/],
  getCompletions: function (editor, session, pos, prefix, callback) {
    if (prefix.length === 0) {
      return callback(null, []);
    } else {
      return callback(null, autoCompleteData);
    }
  }
};
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
});
var langTools = ace.require("ace/ext/language_tools");
langTools.addCompleter(tangideCompleter);

// 设置全屏
editor.commands.addCommand({
  name: "fullscreen",
  bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
  exec: function (editor) {
    // 通过css来控制全屏
    if (editor.isFullScreen) {
      $('#interface-data').css({
        position: 'relative',
        left: 0,
        top: 0,
        width: '100%',
        height: '300px',
        'z-index': 'auto'
      })
      editor.resize();
      editor.isFullScreen = false;
      document.body.style.overflow = "auto";
    } else {
      $('#interface-data').css({
        position: 'fixed',
        left: 0,
        top: 0,
        width: $(window).width(),
        height: $(window).height(),
        'z-index': '1000'
      })
      editor.resize();
      editor.isFullScreen = true;
      document.body.style.overflow = "hidden";
    }
  },
  readOnly: true // 只读下设置可以全屏展示
});

// editor.getSession().setUseWrapMode(true);//设置折叠 默认折叠的
editor.getSession().setTabSize(2);// 设置制表符大小

// 切换状态
function changeStatus(owner, id, isOpen) {
  console.log('1231231', owner.text);
  var param = {
    id: id,
    isOpen: isOpen,
  };
  $.ajax({
    url: '/api/change-interface-mock-status',
    method: 'post',
    dataType: "json",
    data: JSON.stringify(param),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        if (isOpen) {
          alertInfo('Mock状态开启成功,你可以使用Mock数据了');
        } else {
          alertInfo('Mock状态已停用,你可以使用真实的接口数据了');
        }

        searchlist();
      } else {
        alert(data.errorMsg);
      }
    }
  })
}

// 切换接口锁状态
function changeLockStatus(owner, id, value) {
  var param = {
    id: id,
    isLock: value,
  };
  $.ajax({
    url: '/api/change-interface-lock-status',
    method: 'post',
    dataType: "json",
    data: JSON.stringify(param),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        if (value) {
          alertInfo('已锁');
          $(owner).prev().removeClass('d-none');
          $(owner).addClass('d-none');
          $(owner).next().addClass('d-none');
          $(owner).next().next().addClass('d-none');
          $(owner).next().next().next().addClass('d-none');
        } else {
          alertInfo('已解锁');
          $(owner).addClass('d-none');
          $(owner).next().removeClass('d-none');
          $(owner).next().next().removeClass('d-none');
          $(owner).next().next().next().removeClass('d-none');
          $(owner).next().next().next().next().removeClass('d-none');
        }
      } else {
        alert(data.errorMsg);
      }
    }
  })
}



// 复制链接
function copyPath(path) {
  var currentFocus = document.activeElement;// 保存当前活动节点

  let input = document.createElement('input');// 创建一个input标签
  document.body.appendChild(input);// 把标签添加给body
  input.style.opacity = 0;//设置input标签设置为透明(不可见)
  input.value = path;// 把需要复制的值放到input上

  // 记录当前滚动位置, 因为添加节点并选中的时候回影响页面滚动
  let scrollY = window.scrollY;

  input.focus();// input节点获取焦点
  input.setSelectionRange(0, input.value.length);// 选中input框中的所有文字

  var res = document.execCommand('copy', true);// 复制文字并获取结果

  currentFocus.focus();// 之前活动节点获得焦点
  document.body.removeChild(input);// 删除添加的input节点

  // 页面滚动到之前位置
  window.scrollTo(0, scrollY);

  alertInfo("已复制", "success");
}

// 选择下拉框
function selectedDropdown(owner) {
  $(owner).parent().prev().text($(owner).text());
  $(owner).parent().prev().attr('data-value', $(owner).attr('data-value'));
}

// 封装alert
function alertInfo(content, type) {
  $('#alert').text(content);
  var alertEle = document.getElementById('alert');
  alertEle.className = 'alert position-fixed w-50' + ' alert-' + (type || 'success');
  $('#alert').fadeIn('fast');

  setTimeout(() => {
    $('#alert').fadeOut('slow');
  }, 2500);
}

// 切换预览与编辑
function changePreview(owner, isPreview) {
  if (isPreview) {
    $('#interface-data').hide();
    $('#preview').show();
    $(owner).removeClass('btn-outline-primary').addClass('btn-primary');
    $(owner).prev().removeClass('btn-primary').addClass('btn-outline-primary');

    //mock
    try {
      var mock = JSON5.parse(editor.getValue());
      $('#preview').val(JSON.stringify(Mock.mock(mock), null, 4));
    } catch (reason) {
      $('#preview').val('格式错误:' + reason);
    }
  } else {
    $('#interface-data').show();
    $('#preview').hide();
    $(owner).removeClass('btn-outline-primary').addClass('btn-primary');
    $(owner).next().removeClass('btn-primary').addClass('btn-outline-primary');
  }
}

// 校验表单必填项
function checkForm() {
  if (!$('#interface-name').val()) {
    alertInfo('请输入接口名称', 'warning');
    return false;
  }
  if (!$('#interface-path').val()) {
    alertInfo('请输入接口地址', 'warning');
    return false;
  }
  return true;
}

// 处理分页
function formatPage(currentPage, pages) {
  currentPage = currentPage * 1;
  pages = pages * 1;
  var prevPage, nextPage, pageList = [];
  if (currentPage > 1) {
    prevPage = currentPage - 1;
  } else {
    prevPage = 1;
  }
  if (currentPage < pages) {
    nextPage = currentPage + 1;
  } else {
    nextPage = currentPage;
  }
  if (currentPage <= 4) {
    for (var i = 1; i <= (pages < 7 ? pages : 7); i++) {
      pageList.push(i);
    }
  } else if (currentPage > 4 && pages >= (currentPage + 3)) {
    for (var i = (currentPage - 3); i <= (currentPage + 3); i++) {
      pageList.push(i);
    }
  } else if (currentPage > 4 && pages == (currentPage + 2)) {
    for (var i = (currentPage - 4); i <= pages; i++) {
      pageList.push(i);
    }
  } else if (currentPage > 4 && pages == (currentPage + 1)) {
    for (var i = ((currentPage - 5) < 1 ? 1 : (currentPage - 5)); i <= pages; i++) {
      pageList.push(i);
    }
  } else if (currentPage > 4 && pages == currentPage) {
    for (var i = ((currentPage - 6) < 1 ? 1 : (currentPage - 6)); i <= pages; i++) {
      pageList.push(i);
    }
  }

  return {
    prevPage: prevPage,
    nextPage: nextPage,
    pageList: pageList,
    page: currentPage,
    pages: pages,
  }
}

// 查询列表数据
function searchlist(page, rows) {
  var param = {
    page: page,
    rows: rows ? rows : ($('#rows').length > 0 ? $('#rows').html() * 1 : 20)
  };
  if ($('#search-name').val()) {
    param.name = $('#search-name').val();
  }
  if ($('#search-url').val()) {
    param.url = $('#search-url').val();
  }
  $.get('/api/get-interface-list', param, function (data) {
    var html = Handlebars.compile($('#list-template').html());
    $("#table-tbody").html(html(data.data.list));

    // 处理分页数据
    var pageData = formatPage(data.data.page, data.data.pages);
    pageData.total = data.data.total;
    pageData.rows = data.data.rows;
    var page = Handlebars.compile($('#page-template').html());
    $("#page").html(page(pageData));
  })
}

searchlist(1);

// 打开新增弹出框
function openAddModal() {
  $('#interface-method').attr('disabled', false);
  $('#interface-prefix').attr('disabled', false);
  $('#interface-method').attr('data-value', 'GET');
  $('#interface-prefix').attr('data-value', '');
  $('#interface-method').text('GET');
  $('#interface-prefix').text('无接口前缀');

  $('#exampleModalLabel').text('新增接口');
  $('#init-data-btn').show();

  $('#save-btn').show();
  $('#update-btn').hide();

  $('#interface-name').prop('disabled', false);
  $('#interface-path').prop('disabled', false);

  $('#interface-name').val('');
  $('#interface-path').val('');

  $('#init-mock-btn').show();

  editor.setValue('');
  editor.setReadOnly(false);//设置编辑器取消只读
}

// 打开导入swagger接口弹出框
function openImportSwaggerInterfaceModal() {
  $('#importSwaggerInterfaceModal').modal('show');
  $('#swagger-json-address').val('');
  $("#swagger-path-warp").html('');
}

// 获取swagger数据
var tagList = [];
var pathList = [];
function getSwaggerJsonData(owner) {
  if ($('#swagger-json-address').val() === '' || $('#swagger-json-address').val() === undefined) {
    alertInfo('请输入地址', 'danger')
    return;
  }
  $(owner).css('display', 'none');
  $(owner).next().css('display', '');
  // reset
  tagList = [];
  pathList = [];
  // fetch($('#swagger-json-address').val(), {
  //   method:'get'
  // }).then(function (res) {
  //   console.log(res);
  //   if (res.ok) {
  //     return res.json();
  //   }
  // }).then(function (params) {
  //   console.log(params)
  // }).catch(function (params) {
  //   console.log('error',params)
  // })
  // return;
  $.get($('#swagger-json-address').val(), function (res) {
    $(owner).css('display', '');
    $(owner).next().css('display', 'none');

    console.time('>>>>>>')
    function getDefinitionDto(dtoName) {
      var dto = {};
      Object.keys(res.definitions).forEach(function (definitionKey) {
        if (definitionKey === dtoName) {
          var dtoEmp = res.definitions[definitionKey];
          Object.keys(dtoEmp.properties).forEach(function (propertyKey) {
            var property = dtoEmp.properties[propertyKey];
            if (property.type === 'object') {
              var ref
              if (property.schema) {
                ref = property.schema.$ref;
                var dtoName = ref.substr(ref.lastIndexOf('/') + 1);
                dto[propertyKey] = getDefinitionDto(dtoName);
              } else {
                dto[propertyKey] = {};
              }
            } else if (property.type === 'array') {
              if (property.items) {
                if (property.items.$ref) {
                  var ref = property.items.$ref;
                  var dtoName = ref.substr(ref.lastIndexOf('/') + 1);
                  dto[propertyKey] = [getDefinitionDto(dtoName)];
                } else {
                  dto[propertyKey] = [property.items.type]
                }

              } else {
                dto[propertyKey] = [];
              }
            } else {
              dto[propertyKey] = property.type;
            }
          })
        }
      })
      return dto;
    }
    res.tags.forEach(function (tag) {
      var paths = [];
      Object.keys(res.paths).forEach(function (pathKey) {
        Object.keys(res.paths[pathKey]).forEach(function (methodKey) {
          var path = res.paths[pathKey][methodKey];
          if (path.tags[0] === tag.name) {
            // 找到响应数据
            var resData = {};
            if (path.responses[200].schema.$ref) {
              var ref = path.responses[200].schema.$ref;
              var n = ref.lastIndexOf('/') + 1
              var dtoName = ref.substr(n);
              resData = getDefinitionDto(dtoName)
            } else {
              resData = path.responses[200].schema.type;
            }

            paths.push({
              name: path.summary,
              path: pathKey,
              data: resData,
              sourceData: JSON5.stringify(JSON.stringify(resData, null, 4)),
              method: methodKey.toLocaleUpperCase(),
              prefix: res.basePath,
              isOpen: true,
            })
          }
        })
      })
      tagList.push({
        name: tag.name,
        paths: paths
      })
      pathList = pathList.concat(paths);
    })
    console.timeEnd('>>>>>>')

    var swaggerListTemplate = Handlebars.compile($("#swagger-path-template").html());
    $("#swagger-path-warp").html(swaggerListTemplate(tagList));
  })
}

// 导入全选
function changeTagPaths(owner, e) {
  e = e || window.event;
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
  var isChechk = $(owner).prop("checked");
  $(owner).parent().next().find("input[name='swagger-tag-path']").each(function (index, data) {
    $(data).prop("checked", isChechk);
  })
}

// 确认导入
function confirmImport() {
  var selectedPath = [];
  var param = []; // 保存的接口列表
  $("#swagger-path-warp").find("input[name='swagger-tag-path']:checked").each(function (index, data) {
    selectedPath.push($(data).val())
  })
  pathList.forEach(function (path) {
    selectedPath.forEach(function (pathStr) {
      if (pathStr === path.path) {
        param.push(path);
      }
    })
  })

  $.ajax({
    url: '/api/import-interface',
    method: 'post',
    dataType: "json",
    data: JSON.stringify(param),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        $('#importSwaggerInterfaceModal').modal('hide');
        alertInfo('保存成功', 'success');

        searchlist(1);
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    }
  })
}

// 清空接口
function removeInterface() {
  var emp = window.confirm('是否清空接口?');
  if (emp) {
    $.get('/api/delete-all-interface', function (data) {
      if (data.success) {
        searchlist(1);
        alertInfo('清空成功', 'success');
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    })
  }
}

// 新增保存接口
function saveInterface() {

  if (!checkForm()) return;

  var data = editor.getValue();

  try {
    var json5Data = JSON5.parse(data);
  } catch (reason) {
    alertInfo(reason, 'danger');
    return;
  }

  var param = {
    name: $('#interface-name').val(),
    path: $('#interface-path').val(),
    data: Mock.mock(json5Data),
    sourceData: JSON5.stringify(data),
    method: $('#interface-method').attr('data-value'),
    prefix: $('#interface-prefix').attr('data-value'),
    isOpen: true,
  };

  $.ajax({
    url: '/api/add-interface',
    method: 'post',
    dataType: "json",
    data: JSON.stringify(param),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        alertInfo('保存成功', 'success');
        $('#exampleModal').modal('hide');
        $('#interface-name').val('');
        $('#interface-path').val('');

        searchlist(1);
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    }
  })
}

// 查看接口
function getInterface(id) {
  $('#exampleModalLabel').text('查看接口');
  $('#init-data-btn').hide();

  editor.setReadOnly(true);

  $('#exampleModal').modal('show');
  $('#save-btn').hide();
  $('#update-btn').hide();
  $('#init-mock-btn').hide();

  $.ajax({
    url: '/api/get-interface-detail',
    method: 'post',
    dataType: "json",
    data: JSON.stringify({
      id: id
    }),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        $('#interface-name').val(data.data.name);
        $('#interface-path').val(data.data.path);
        $('#interface-method').attr('disabled', true);
        $('#interface-method').text(data.data.method);
        $('#interface-prefix').attr('disabled', true);
        $('#interface-prefix').text(data.data.prefix ? data.data.prefix : '无接口前缀');
        editor.setValue(JSON5.parse(data.data.sourceData));


        $('#interface-name').prop('disabled', true);
        $('#interface-path').prop('disabled', true);
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    }
  })
}

// 打开编辑弹出框调用编辑回显接口
function editInterface(id) {
  $('#exampleModalLabel').text('编辑接口');
  $('#init-data-btn').hide();
  $('#interface-method').attr('disabled', false);
  $('#interface-prefix').attr('disabled', false);

  $('#exampleModal').modal('show');
  $('#save-btn').hide();
  $('#update-btn').show();
  $('#update-btn').prop("data-id", id);
  $('#interface-name').prop('disabled', false);
  $('#interface-path').prop('disabled', false);
  $('#init-mock-btn').show();
  $.ajax({
    url: '/api/get-interface-detail',
    method: 'post',
    dataType: "json",
    data: JSON.stringify({
      id: id
    }),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        $('#interface-name').val(data.data.name);
        $('#interface-path').val(data.data.path);
        $('#interface-method').attr('data-value', data.data.method);
        $('#interface-method').text(data.data.method);
        $('#interface-prefix').attr('data-value', data.data.prefix);
        $('#interface-prefix').text(data.data.prefix ? data.data.prefix : '无接口前缀');

        editor.setValue(JSON5.parse(data.data.sourceData));
        editor.setReadOnly(false);
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    }
  })
}

// 删除接口
function deleteInterface(id) {
  var emp = confirm('是否删除该接口？');
  if (emp != 0) {
    // 调删除接口
    $.ajax({
      url: '/api/delete-interface',
      method: 'post',
      dataType: "json",
      data: JSON.stringify({
        id: id
      }),
      contentType: "application/json",
      success: function (data) {
        if (data.success) {
          alertInfo('删除成功');

          searchlist(1);
        } else {
          alertInfo(data.errorMsg, 'danger');
        }
      }
    })
  }
}

// 更新接口
function updateInterface() {
  if (!checkForm()) return;
  var data = editor.getValue();
  try {
    var json5Data = JSON5.parse(data);
  } catch (reason) {
    alertInfo(reason, 'danger');
    return;
  }
  var param = {
    id: $('#update-btn').prop("data-id"),
    name: $('#interface-name').val(),
    path: $('#interface-path').val(),
    data: Mock.mock(json5Data),
    sourceData: JSON5.stringify(data),
    method: $('#interface-method').attr('data-value'),
    prefix: $('#interface-prefix').attr('data-value'),
  };
  $.ajax({
    url: '/api/update-interface',
    method: 'post',
    dataType: "json",
    data: JSON.stringify(param),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        alertInfo('更新成功', 'success');
        $('#exampleModal').modal('hide');

        searchlist(1);
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    }
  })
}
var baseId = '';
var basePageId = '';
$.get('/api/get-base-list', {}, function (data) {
  if (data.success && data.length != 0) {
    data.data.forEach((item) => {
      if (item.type == 'base-data') {
        baseId = item._id;
      } else {
        basePageId = item._id;
      }
    })
  }
})

// 初始化基础数据
function initBaseData(type) {
  var id;
  if (type == 'base-data') {
    id = baseId;
  } else {
    id = basePageId;
  }
  if (!id) {
    alertInfo('还没有维护基础数据,请去维护基础数据', 'warning');
    return;
  }
  $.ajax({
    url: '/api/get-base-data-by-id',
    method: 'post',
    dataType: "json",
    data: JSON.stringify({
      id: id
    }),
    contentType: "application/json",
    success: function (data) {
      if (data.success) {
        editor.setValue(JSON.stringify(data.data.data, null, 2));
      } else {
        alertInfo(data.errorMsg, 'danger');
      }
    }
  })
}

// 生成mock数据
function initMock() {
  try {
    var mock = JSON5.parse(editor.getValue());
    $('#preview').val(JSON.stringify(Mock.mock(mock), null, 4));
  } catch (reason) {
    alertInfo('格式错误:' + reason, 'danger');
  }
}
