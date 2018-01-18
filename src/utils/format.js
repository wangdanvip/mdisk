const sprintf = function(str) {
  for (let i=1; i<arguments.length; i++) {
    str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i])
  }
  return str
}

export {
  sprintf
}
