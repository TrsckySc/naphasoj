import React from "react";

export class Ace extends React.Component {
  // 启动全屏
  launchFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  // 退出全屏
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  componentDidMount() {
    const owner = this;
    const editor = window.ace.edit("interface-data");
    editor.setTheme("ace/theme/chrome"); //设置主题
    var JavaScriptMode = window.ace.require("ace/mode/json").Mode;
    editor.session.setMode(new JavaScriptMode()); //设置程序语言模式

    // 设置自动补全
    var tangideCompleter = {
      identifierRegexps: [/[a-zA-Z_0-9@\-\u00A2-\uFFFF]/],
      getCompletions: function (editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
          return callback(null, []);
        } else {
          return callback(null, autoCompleteData);
        }
      },
    };
    // 自定义补全列表
    var autoCompleteData = [
      {
        name: "mock string",
        value: "@string",
        caption: "@string",
        meta: "Mock-String",
        type: "local",
        score: 1000,
      },
      {
        name: "mock number",
        value: "@number",
        caption: "@number",
        meta: "Mock-Number",
        score: 1000,
      },
      {
        name: "mock integer",
        value: "@integer",
        caption: "@integer",
        meta: "Mock-Integer",
        score: 1000,
      },
      // {
      //   name: "mock image",
      //   value: Random.image("200x100"),
      //   caption: "@image",
      //   meta: "Mock-Image",
      //   score: 1000,
      // },
    ];
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
    var langTools = window.ace.require("ace/ext/language_tools");
    langTools.addCompleter(tangideCompleter);

    // 设置全屏
    editor.commands.addCommand({
      name: "fullscreen",
      bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
      exec: function (editor) {
        var ele = document.getElementById("interface-data");
        if (editor.isFullScreen) {
          owner.exitFullscreen();
          editor.isFullScreen = false;
        } else {
          owner.launchFullscreen(ele);
          editor.isFullScreen = true;
        }
      },
      readOnly: true, // 只读下设置可以全屏展示
    });

    // editor.getSession().setUseWrapMode(true);//设置折叠 默认折叠的
    editor.getSession().setTabSize(2); // 设置制表符大小
  }

  render() {
    return (
      <div
        id="interface-data"
        style={{ width: "100%", height: "200px", position: "relative" }}
      ></div>
    );
  }
}
