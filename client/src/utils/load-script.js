/**
 * 批量加载script脚本
 * @param {*} srcList src地址集合
 */
export function LoadScript(srcList) {
  let scPromise = [];
  srcList.forEach((src) => {
    scPromise.push(load(src));
  });
  return Promise.all(scPromise);
}

function load(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject();
    };
    document.body.appendChild(script);
  });
}
