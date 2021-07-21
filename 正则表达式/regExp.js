// 身份证验证方案1:
// 地址码判定不够精确。例：我国并不存在16，26开头的地区，却可通过验证
// 日期判定不够精确。例:19490231也可通过验证，而2月并不存在31日
// 校验码是由17位本体码计算得出，方案1并未校验此码
let validIdcard= /^[1-9]\d{5}(18 | 19 | 20)\d{2}((0[1-9]) | (1[0-2]))(([0-2][0-9])| 10 | 20 | 30 | 31)\d{3}[0-9Xx]/
console.log(validIdcard.test("11010519491231002X"));
//输出 false 不能以0开头
console.log(validIdcard.test("01010519491231002X"));
//输出 false 年份不能以17开头
console.log(validIdcard.test("11010517491231002X"));
//输出 false 月份不能为13
console.log(validIdcard.test("11010519491331002X"));
//输出 false 日期不能为32
console.log(validIdcard.test("11010519491232002X"));
//输出 false 不能以a结尾
console.log(validIdcard.test("11010519491232002a"));