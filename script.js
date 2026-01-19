// 图片字幕生成器核心功能

// 获取DOM元素
const imageInput = document.getElementById('image-input');
const uploadBtn = document.querySelector('.upload-btn');
const imageInfo = document.getElementById('image-info');
const imageUploader = document.querySelector('.image-uploader');

const fontSizeInput = document.getElementById('font-size');
const lineHeightInput = document.getElementById('line-height');
const fontColorInput = document.getElementById('font-color');
const outlineColorInput = document.getElementById('outline-color');
const outlineWidthInput = document.getElementById('outline-width');
const bgColorInput = document.getElementById('bg-color');
const bgOpacityInput = document.getElementById('bg-opacity');
const bgPaddingInput = document.getElementById('bg-padding');

const opacityValue = document.getElementById('opacity-value');
const paddingValue = document.getElementById('padding-value');

const subtitleContent = document.getElementById('subtitle-content');

const previewCanvas = document.getElementById('preview-canvas');
const previewPlaceholder = document.getElementById('preview-placeholder');
const generateBtn = document.getElementById('generate-btn');
const saveBtn = document.getElementById('save-btn');

// 获取Canvas上下文
const ctx = previewCanvas.getContext('2d');

// 初始化变量
let uploadedImage = null;
let generatedImage = null;

// 配置项
const config = {
    fontSize: 60,
    lineHeight: 99,
    fontColor: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 3,
    bgColor: '#ffff00',
    bgOpacity: 0.7,
    bgPadding: 50,
    subtitleText: ''
};

// 初始化事件监听
function initEventListeners() {
    // 图片上传事件
    imageInput.addEventListener('change', handleImageUpload);
    
    // 拖拽事件
    imageUploader.addEventListener('dragover', handleDragOver);
    imageUploader.addEventListener('dragleave', handleDragLeave);
    imageUploader.addEventListener('drop', handleDrop);
    
    // 样式设置事件
    fontSizeInput.addEventListener('input', () => updateConfig('fontSize', parseInt(fontSizeInput.value)));
    lineHeightInput.addEventListener('input', () => updateConfig('lineHeight', parseInt(lineHeightInput.value)));
    fontColorInput.addEventListener('input', () => updateConfig('fontColor', fontColorInput.value));
    outlineColorInput.addEventListener('input', () => updateConfig('outlineColor', outlineColorInput.value));
    outlineWidthInput.addEventListener('input', () => updateConfig('outlineWidth', parseInt(outlineWidthInput.value)));
    bgColorInput.addEventListener('input', () => updateConfig('bgColor', bgColorInput.value));
    
    bgOpacityInput.addEventListener('input', () => {
        updateConfig('bgOpacity', parseFloat(bgOpacityInput.value));
        opacityValue.textContent = bgOpacityInput.value;
    });
    
    bgPaddingInput.addEventListener('input', () => {
        updateConfig('bgPadding', parseInt(bgPaddingInput.value));
        paddingValue.textContent = bgPaddingInput.value;
    });
    
    // 字幕内容事件
    subtitleContent.addEventListener('input', () => updateConfig('subtitleText', subtitleContent.value));
    
    // 生成和保存事件
    generateBtn.addEventListener('click', generateImage);
    saveBtn.addEventListener('click', saveImage);
}

// 处理图片上传
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processImageFile(file);
    }
}

// 处理拖拽事件
function handleDragOver(e) {
    e.preventDefault();
    imageUploader.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    imageUploader.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    imageUploader.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    }
}

// 处理图片文件
function processImageFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            imageInfo.textContent = `已上传: ${file.name} (${img.width}x${img.height})`;
            
            // 更新预览
            updatePreview();
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// 更新配置
function updateConfig(key, value) {
    config[key] = value;
    updatePreview();
}

// 更新预览
function updatePreview() {
    if (!uploadedImage) return;
    
    // 计算字幕区域高度
    const lines = config.subtitleText.split('\n').filter(line => line.trim());
    const subtitleHeight = lines.length > 0 ? lines.length * config.lineHeight : 0;
    
    // 设置Canvas大小（原图高度 + 字幕区域高度）
    previewCanvas.width = uploadedImage.width;
    previewCanvas.height = uploadedImage.height + subtitleHeight;
    
    // 显示Canvas，隐藏占位符
    previewCanvas.style.display = 'block';
    previewPlaceholder.style.display = 'none';
    
    // 清空Canvas
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // 绘制原图
    ctx.drawImage(uploadedImage, 0, 0);
    
    // 如果有字幕内容，绘制字幕
    if (config.subtitleText && lines.length > 0) {
        drawSubtitle(lines, subtitleHeight);
    }
}

// 绘制字幕（实现文字背景切割效果）
function drawSubtitle(lines, subtitleHeight) {
    const padding = config.bgPadding;
    const lineHeight = config.lineHeight;
    
    // 设置字体样式
    ctx.font = `${config.fontSize}px Arial`;
    ctx.textAlign = 'center';
    
    // 绘制每行文字
    lines.forEach((line, index) => {
        if (!line.trim()) return;
        
        // 计算文字宽度
        const textWidth = ctx.measureText(line).width;
        
        // 计算当前行的Y坐标（从原图底部开始）
        const currentY = uploadedImage.height + (index * lineHeight) + (config.fontSize * 0.8);
        
        // 计算背景区域
        const bgX = (previewCanvas.width - textWidth) / 2 - padding;
        const bgY = currentY - config.fontSize * 0.8 - padding / 2;
        const bgWidth = textWidth + (padding * 2);
        const bgHeight = config.fontSize + padding;
        
        // 绘制背景（切割效果：每行独立背景）
        ctx.fillStyle = hexToRgba(config.bgColor, config.bgOpacity);
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        
        // 绘制文字轮廓
        if (config.outlineWidth > 0) {
            ctx.strokeStyle = config.outlineColor;
            ctx.lineWidth = config.outlineWidth;
            ctx.lineJoin = 'round';
            ctx.strokeText(line, previewCanvas.width / 2, currentY);
        }
        
        // 绘制文字
        ctx.fillStyle = config.fontColor;
        ctx.fillText(line, previewCanvas.width / 2, currentY);
    });
}

// 将十六进制颜色转换为RGBA
function hexToRgba(hex, opacity) {
    // 移除#号
    hex = hex.replace('#', '');
    
    // 解析RGB值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // 返回RGBA格式
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// 生成图片
function generateImage() {
    if (!uploadedImage || !config.subtitleText) {
        alert('请先上传图片并输入字幕内容！');
        return;
    }
    
    // 更新预览
    updatePreview();
    
    // 标记为已生成
    generatedImage = previewCanvas;
    
    // 启用保存按钮
    saveBtn.disabled = false;
    saveBtn.classList.add('enabled');
    
    // 显示成功提示
    alert('图片生成成功！请点击保存图片按钮下载。');
}

// 保存图片
function saveImage() {
    if (!generatedImage) return;
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'subtitle-image.png';
    link.href = generatedImage.toDataURL('image/png');
    
    // 触发下载
    link.click();
    
    // 清理
    link.remove();
}

// 初始化应用
function initApp() {
    // 设置初始值显示
    opacityValue.textContent = bgOpacityInput.value;
    paddingValue.textContent = bgPaddingInput.value;
    
    // 初始化事件监听
    initEventListeners();
    
    console.log('图片字幕生成器初始化完成！');
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initApp);

// 测试数据（用于开发调试）
function testData() {
    // 示例字幕内容
    subtitleContent.value = '别划走\n我在给自己写的网站呢\n对，这牛头...';
    config.subtitleText = subtitleContent.value;
    
    // 更新预览
    updatePreview();
}

// 取消注释以启用测试数据
// testData();