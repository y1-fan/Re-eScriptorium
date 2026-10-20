<template>
    <div>
        <template v-if="$lang === 'zh'">
            <p>
                <b>左键点击</b>图像可<u>创建</u>新行，<b>右键点击</b>可<b>添加控制点</b>，再次<b>左键点击</b><u>完成</u>该行。
                <br>按住鼠标按键不放可以自由绘制。
                <br>绘制行时按 <b>Esc</b> 会<u>取消</u>当前绘制。
                <br>如果你需要处理区域，请先切换到区域模式 <i class="fas fa-th-large" />（R 键）。
                <br>在区域模式下，<b>左键点击</b>可创建新的矩形区域，再次左键点击即可完成。
                <br>在区域内绘制的行会自动绑定到该区域。
                <br>当分割质量良好时，可以让系统计算掩码 <i class="text-success fas fa-thumbs-up" />，
                <br>页面一旦已有掩码，新增的行会自动获得掩码，修改行时也会重新计算其掩码。
                <br><b>注意</b>：掩码质量在很大程度上取决于整体分割的质量，而不只是该行本身，
                <br>因此请务必在计算掩码之前绘制完所有行。
                <br>也可以进入「图像」标签页 → 分割 → 选择“仅掩码”，<i>批量</i>计算掩码。
            </p>
            <p>
                <b>左键点击</b>某一行即可选中，然后可以拖动离鼠标最近的控制点。
                <br><b>双击</b>该行会在鼠标位置<u>新建控制点</u>。
                <br>选中一行（或多行）后，使用反转按钮 <i class="fas fa-arrow-alt-h" />（I 键）可以反转该行控制点的顺序。
                <br>在区域模式下，区域也可以用同样的方式编辑。
                <br>使用对应按钮 <i class="fas fa-link" />（Y 键）<i class="fas fa-unlink"></i>（U 键）可以将选中的行与区域关联或取消关联。
                <br>使用剪切模式 <i class="text-warning fas fa-cut" />（C 键）可以切断行，将其分成两段或删除其中一部分。
                <br>至少选中两行时，会出现合并它们的选项 <i class="fas fa-compress-arrows-alt" />（J 键）。
                <br>可以配合 <b>Ctrl+Z</b>（撤销）和 <b>Ctrl+Y</b>（重做），或使用对应的按钮 <i class="fas fa-undo" /><i class="fas fa-redo" />，来回浏览修改<u>历史</u>。
            </p>
            <p>
                <b>Shift+点击</b>可以将某行加入或移出<u>选区</u>，
                <br>点击空白处会清除选区，
                <br><b>Shift+拖动</b>会创建<u>套索</u>选择工具，用于选择控制点（选中后显示为黑色）。
                <br><b>注意：</b>如果已经选中了行，套索只会选择这些行中的控制点。
                <br><b>Ctrl+拖动</b>可以一次性移动所有选中的控制点（如果没有选中控制点，则移动选中的行）。
                <br>红色垃圾桶按钮 <i class="text-danger fas fa-trash" /> 会<b>删除</b>所有选中的<b>行/区域</b>，
                <br>黄色垃圾桶按钮 <i class="text-warning fas fa-trash" /> 只会<b>删除</b>选中的<b>控制点</b>。
            </p>
        </template>
        <template v-else>
            <p>
                <b>Left click</b> on the image to <u>create</u> new line, <b>Right click</b> to <b>add points</b> and <b>Left click</b> again to <u>finish</u> it.
                <br>You can keep the mouse button pressed for free drawing.
                <br>Hitting <b>escape</b> while drawing a line <u>cancels</u> it.
                <br>If regions matter to you switch to region mode first <i class="fas fa-th-large" /> (R key).
                <br>when in region mode <b>Left click</b> to create a new rectangular region, left click again to finish it.
                <br>lines drawn inside a region will automatically be bound to it.
                <br>When the quality of the segmentation is good, you can prompt the system to calculate masks <i class="text-success fas fa-thumbs-up" />,
                <br>once a page already has masks new lines will automatically get a mask and updating a line will also recalculate its mask.
                <br><b>Note</b> that the quality of the masks is highly dependent on the quality of the whole segmentation, not only the corresponding line,
                <br>so make sure to draw all the lines before calculating the masks.
                <br>You can also have the option to calculate the masks <i>en masse</i> in the Images tab -> segment -> choose 'Only masks'.
            </p>
            <p>
                <b>Left click</b> on a line to select it, then you can drag its closest control point.
                <br><b>Double click</b> on the line will create a <u>new control point</u> at the mouse location.
                <br>You can reverse the order of the line's points by selecting a line (or multiple) and using reverse <i class="fas fa-arrow-alt-h" /> (I key).
                <br>When in region mode, Regions can be edited the same way.
                <br>Selected lines can be linked or unlinked to regions with the corresponding buttons <i class="fas fa-link" />(Y key) <i class="fas fa-unlink"> (U key).</i>
                <br>By using the cut mode <i class="text-warning fas fa-cut" /> (C key) you can cut through lines, splitting them in two or removing part of them.
                <br>If at least two lines are selected an option to join them becomes available <i class="fas fa-compress-arrows-alt" /> (J key).
                <br>You can go through your changes <u>history</u> back and forth with <b>Ctrl+Z</b>(undo) and <b>Ctrl+Y</b>(redo) or by using the corresponding buttons <i class="fas fa-undo" /><i class="fas fa-redo" />.
            </p>
            <p>
                <b>Shift+click</b> allows to add or remove a line from the <u>selection</u>,
                <br>Clicking on an empty space clears the selection,
                <br><b>shift and drag</b> creates a <u>lasso</u> selection tool that allows to select control points (they then appear black).
                <br><b>Note:</b> If lines are already selected the lasso will only select points in those lines.
                <br><b>Ctrl+drag</b> allows to move all the selected control points at once (or the selected lines if no control points are selected).

                <br>The red trash <i class="text-danger fas fa-trash" /> button <b>deletes</b> all selected <b>lines/regions</b>,
                <br>The yellow trash button <i class="text-warning fas fa-trash" /> only <b>deletes</b> selected control <b>points</b>.
            </p>
        </template>
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
</style>
