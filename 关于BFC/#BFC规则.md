#BFC规则
1.垂直方向一个接一个放置
2.box之间距离由margin决定,两个相邻box之间margin会合并
3.BFC不会与flat浮动元素重叠(可以利用这一点来避免被浮动元素遮挡)
4.计算高度时会计入浮动元素(这种方案是优于在前面加个空table的)
5.是独立渲染区域,不会被外部影响,也不会影响外部
6.box的左边界是和borderbox左边界相接触的

<!-- 触发BFC -->
1.根元素/body
2.float属性不为none;
3.position属性为fixed或absolute;
4.display属性为(5): table-cell, inline-block; flex;inline-flex;table-caption;
5.overflow不为visible;
(overflow,display,float,position,body)