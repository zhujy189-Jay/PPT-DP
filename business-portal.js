// 商机管理门户核心功能

// 获取DOM元素
const addBusinessBtn = document.getElementById('add-business-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const modalSave = document.getElementById('modal-save');
const confirmModal = document.getElementById('confirm-modal');
const confirmModalClose = document.getElementById('confirm-modal-close');
const confirmCancel = document.getElementById('confirm-cancel');
const confirmYes = document.getElementById('confirm-yes');
const businessCards = document.getElementById('business-cards');
const bannerNotification = document.getElementById('banner-notification');
const notificationText = document.getElementById('notification-text');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');

// 表单元素
const businessForm = document.getElementById('business-form');
const businessId = document.getElementById('business-id');
const businessCategory = document.getElementById('business-category');
const businessTitle = document.getElementById('business-title');
const businessDescription = document.getElementById('business-description');
const businessWpsLink = document.getElementById('business-wps-link');
const businessPriority = document.getElementById('business-priority');
const businessStatus = document.getElementById('business-status');
const businessAssignee = document.getElementById('business-assignee');
const businessDeadline = document.getElementById('business-deadline');
const businessDate = document.getElementById('business-date');

// 时间检查定时器
let deadlineCheckInterval = null;

// 商机数据存储
let businesses = [];
let currentBusinessId = null;
let pendingCompleteId = null;

// 邮件接收者列表
const emailRecipients = [
    'zhoudingli.sh@chinatelecom.cn', // 周丁立
    'cheny1.sh@chinatelecom.cn',     // 陈悦
    'jiangye.sh@chinatelecom.cn',     // 蒋叶
    'xubc@chinatelecom.cn',           // 徐博川
    'shichunhui.sh@chinatelecom.cn',  // 施春辉
    'gongluchao.sh@chinatelecom.cn',  // 龚路超
    'xucong.sh@chinatelecom.cn',      // 许聪
    'xiayulin.sh@chinatelecom.cn',    // 夏玉林
    'yuxin.sh@chinatelecom.cn',       // 俞鑫
    'dongchundi.sh@chinatelecom.cn',  // 董春弟
    'zhudan.sh@chinatelecom.cn',      // 朱丹
    'gd_shenyi.sh@chinatelecom.cn',   // 沈祎
    'qianjunmin.sh@chinatelecom.cn',  // 钱军民
    'gd_luhaolei.sh@chinatelecom.cn', // 陆浩雷
    'zhangguanjin.sh@chinatelecom.cn',// 张冠津
    'yuanye.sh@chinatelecom.cn',      // 袁烨
    'xb31700159.sh@chinatelecom.cn',  // 徐斌
    'shenhongwei.sh@chinatelecom.cn', // 沈宏伟
    'zhoudf1@chinatelecom.cn',        // 周迪凡
    'xud15@chinatelecom.cn',          // 徐诞
    'zhangluxi.sh@chinatelecom.cn',   // 张卢希
    'wumingming.sh@chinatelecom.cn',  // 吴明明
    'wangj4.sh@chinatelecom.cn',      // 王健
    'shenluyi.sh@chinatelecom.cn',    // 沈璐祎
    'zhangf1.sh@chinatelecom.cn',     // 张帆-政企中心
    'limingguang.sh@chinatelecom.cn', // 李明光
    'panhui.sh@chinatelecom.cn',      // 潘辉
    'gaoxuan.sh@chinatelecom.cn',     // 高璇
    'yuyinying.sh@chinatelecom.cn',   // 俞胤颖
    'wangyi.sh@chinatelecom.cn',      // 王壹
    'yangpyx@chinatelecom.cn',        // 杨潘宇枭
    'chenyumiao.sh@chinatelecom.cn',  // 陈育苗
    'sunliang.sh@chinatelecom.cn'     // 孙亮
];

// 类别映射
const categoryMap = {
    'basic': '基础业务',
    'innovation': '战新产数',
    'major': '重大项目'
};

// 优先级映射
const priorityMap = {
    'must': '必拜访',
    'reference': '参考级'
};

// 状态映射
const statusMap = {
    'in-progress': '进行中',
    'completed': '已完成'
};

// 检查截止时间
function checkDeadlines() {
    const currentDate = getCurrentDate();
    let hasUpdates = false;
    
    businesses.forEach(business => {
        if (business.deadline && business.status === 'in-progress') {
            if (business.deadline < currentDate) {
                business.status = 'completed';
                business.completed = true;
                hasUpdates = true;
                updateNotificationAndEmail(`已超过截止时间，自动标记为已完成`, business);
            }
        }
    });
    
    if (hasUpdates) {
        saveToStorage();
        renderBusinesses();
    }
}

// 初始化应用
function initApp() {
    // 从localStorage加载数据
    loadFromStorage();
    
    // 如果没有数据，添加示例数据
    if (businesses.length === 0) {
        addSampleData();
    }
    
    // 检查截止时间
    checkDeadlines();
    
    // 渲染商机列表
    renderBusinesses();
    
    // 初始化事件监听
    initEventListeners();
    
    // 启动定时器，每小时检查一次截止时间
    deadlineCheckInterval = setInterval(checkDeadlines, 3600000);
    
    console.log('松江电信商机管理统一门户初始化完成！');
}

// 添加示例数据
function addSampleData() {
    // 获取当前日期和未来日期
    const currentDate = getCurrentDate();
    const futureDate = getThirdMonthLastDay(); // 第三个月最后一天
    const pastDate = getPastDate(3); // 3天前
    
    const sampleBusinesses = [
        {
            id: generateId(),
            category: 'major',
            title: '松江工业园区5G全覆盖项目',
            description: '1、商机CRM录入时商机名需带有"xxxx-"；\n2、派单企业商机转化，联系管理员获取1.2倍激励。\n3、商机执行关系每月KPI是否打折。',
            wpsLink: '',
            priority: 'must',
            status: 'in-progress',
            assignee: '张帆',
            deadline: futureDate,
            date: currentDate,
            completed: false
        },
        {
            id: generateId(),
            category: 'innovation',
            title: '企业数字化转型咨询服务',
            description: '1、商机CRM录入时商机名需带有"xxxx-"；\n2、派单企业商机转化，联系管理员获取1.2倍激励。\n3、商机执行关系每月KPI是否打折。',
            wpsLink: '',
            priority: 'reference',
            status: 'in-progress',
            assignee: '沈璐祎',
            deadline: futureDate,
            date: currentDate,
            completed: false
        },
        {
            id: generateId(),
            category: 'basic',
            title: '松江大学城宽带升级项目',
            description: '1、商机CRM录入时商机名需带有"xxxx-"；\n2、派单企业商机转化，联系管理员获取1.2倍激励。\n3、商机执行关系每月KPI是否打折。',
            wpsLink: '',
            priority: 'must',
            status: 'in-progress',
            assignee: '潘辉',
            deadline: pastDate,
            date: getPastDate(10),
            completed: false
        }
    ];
    
    businesses = sampleBusinesses;
    saveToStorage();
}

// 初始化事件监听
function initEventListeners() {
    // 新增商机按钮
    addBusinessBtn.addEventListener('click', () => openModal());
    
    // 弹窗关闭按钮
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    
    // 保存按钮
    modalSave.addEventListener('click', saveBusiness);
    
    // 确认弹窗
    confirmModalClose.addEventListener('click', closeConfirmModal);
    confirmCancel.addEventListener('click', closeConfirmModal);
    confirmYes.addEventListener('click', confirmComplete);
    
    // 筛选器
    filterCategory.addEventListener('change', renderBusinesses);
    filterPriority.addEventListener('change', renderBusinesses);
    
    // 点击遮罩层关闭弹窗
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });
}

// 生成唯一ID
function generateId() {
    return 'business_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 获取当前日期
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取未来日期
function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取过去日期
function getPastDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取当前日期后第三个月的最后一天
function getThirdMonthLastDay() {
    const date = new Date();
    // 加3个月
    date.setMonth(date.getMonth() + 3);
    // 下个月第一天
    date.setMonth(date.getMonth() + 1, 1);
    // 减一天就是当月最后一天
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 打开新增/编辑弹窗
function openModal(business = null) {
    if (business) {
        // 编辑模式
        modalTitle.textContent = '更新商机派单';
        currentBusinessId = business.id;
        
        businessId.value = business.id;
        businessCategory.value = business.category;
        businessTitle.value = business.title;
        businessDescription.value = business.description || '';
        businessWpsLink.value = business.wpsLink || '';
        businessPriority.value = business.priority;
        businessStatus.value = business.status;
        businessAssignee.value = business.assignee || '';
        businessDeadline.value = business.deadline || '';
        businessDate.value = business.date;
    } else {
        // 新增模式
        modalTitle.textContent = '新增商机派单';
        currentBusinessId = null;
        
        businessForm.reset();
        businessDate.value = getCurrentDate();
        businessStatus.value = 'in-progress'; // 默认状态为进行中
        businessDeadline.value = getThirdMonthLastDay(); // 默认截止时间为第三个月最后一天
        // 设置默认工作要求内容
        businessDescription.value = '1、商机CRM录入时商机名需带有"xxxx-"；\n2、派单企业商机转化，联系管理员获取1.2倍激励。\n3、商机执行关系每月KPI是否打折。';
    }
    
    modalOverlay.classList.add('active');
}

// 关闭弹窗
function closeModal() {
    modalOverlay.classList.remove('active');
    businessForm.reset();
    currentBusinessId = null;
}

// 保存商机
function saveBusiness() {
    // 验证必填字段
    if (!businessCategory.value || !businessTitle.value || !businessPriority.value) {
        alert('请填写所有必填字段！');
        return;
    }
    
    const businessData = {
        category: businessCategory.value,
        title: businessTitle.value,
        description: businessDescription.value,
        wpsLink: businessWpsLink.value,
        priority: businessPriority.value,
        status: businessStatus.value,
        assignee: businessAssignee.value,
        deadline: businessDeadline.value,
        date: businessDate.value
    };
    
    if (currentBusinessId) {
        // 更新现有商机
        const index = businesses.findIndex(b => b.id === currentBusinessId);
        if (index !== -1) {
            businesses[index] = {
                ...businesses[index],
                ...businessData,
                completed: businessStatus.value === 'completed'
            };
            updateNotificationAndEmail(`商机"${businessData.title}"已更新`, businesses[index]);
        }
    } else {
        // 新增商机
        const newBusiness = {
            id: generateId(),
            ...businessData,
            completed: businessStatus.value === 'completed'
        };
        businesses.unshift(newBusiness);
        updateNotificationAndEmail(`新增商机"${businessData.title}"`, newBusiness);
    }
    
    // 检查截止时间
    checkDeadlines();
    
    // 保存到localStorage
    saveToStorage();
    
    // 重新渲染列表
    renderBusinesses();
    
    // 关闭弹窗
    closeModal();
}

// 打开确认完成弹窗
function openConfirmModal(businessId) {
    pendingCompleteId = businessId;
    confirmModal.classList.add('active');
}

// 关闭确认弹窗
function closeConfirmModal() {
    confirmModal.classList.remove('active');
    pendingCompleteId = null;
}

// 确认完成
function confirmComplete() {
    if (pendingCompleteId) {
        const index = businesses.findIndex(b => b.id === pendingCompleteId);
        if (index !== -1) {
            businesses[index].completed = true;
            businesses[index].status = 'completed';
            saveToStorage();
            renderBusinesses();
            updateNotificationAndEmail(`商机"${businesses[index].title}"已完成`, businesses[index]);
        }
    }
    closeConfirmModal();
}

// 切换完成状态
function toggleComplete(businessId) {
    const index = businesses.findIndex(b => b.id === businessId);
    if (index !== -1) {
        if (businesses[index].completed) {
                // 取消完成状态
                businesses[index].completed = false;
                businesses[index].status = 'in-progress';
                saveToStorage();
                renderBusinesses();
                updateNotificationAndEmail(`商机"${businesses[index].title}"已重新激活为进行中`, businesses[index]);
            } else {
                // 打开确认弹窗
                openConfirmModal(businessId);
            }
    }
}

// 模拟发送邮件
function sendEmail(subject, content) {
    // 在浏览器环境中，我们无法直接发送真实邮件
    // 这里实现一个模拟功能，并记录日志
    console.log('📧 模拟发送邮件：');
    console.log('收件人：', emailRecipients.join(', '));
    console.log('主题：', subject);
    console.log('内容：', content);
    console.log('--------------------------');
    
    // 在实际项目中，这里应该调用后端API来发送真实邮件
    // 例如：fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ recipients, subject, content }) });
    
    return true;
}

// 更新Banner通知
function updateBannerNotification(message) {
    notificationText.textContent = message;
    bannerNotification.style.animation = 'none';
    bannerNotification.offsetHeight; // 触发重绘
    bannerNotification.style.animation = 'slideIn 0.5s ease-out';
}

// 更新Banner通知并发送邮件
function updateNotificationAndEmail(message, business) {
    // 更新Banner通知
    updateBannerNotification(message);
    
    // 发送邮件通知
    const emailSubject = `【商机管理】${business.title} - ${message}`;
    const emailContent = `
        商机信息更新通知：
        商机标题：${business.title}
        操作：${message}
        类别：${categoryMap[business.category]}
        优先级：${priorityMap[business.priority]}
        负责人：${business.assignee}
        截止时间：${business.deadline}
        创建日期：${business.date}
        
        请支局长总监MVP查看详细信息。
    `;
    
    sendEmail(emailSubject, emailContent);
    
    // 额外显示邮件提示
    setTimeout(() => {
        updateBannerNotification('请支局长总监MVP查看邮件通知');
    }, 5000);
}

// 渲染商机列表
function renderBusinesses() {
    const categoryFilter = filterCategory.value;
    const priorityFilter = filterPriority.value;
    
    // 筛选商机
    let filteredBusinesses = businesses.filter(business => {
        if (categoryFilter !== 'all' && business.category !== categoryFilter) {
            return false;
        }
        if (priorityFilter !== 'all' && business.priority !== priorityFilter) {
            return false;
        }
        return true;
    });
    
    // 清空列表
    businessCards.innerHTML = '';
    
    // 如果没有商机，显示空状态
    if (filteredBusinesses.length === 0) {
        businessCards.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📋</div>
                <p class="empty-state-text">暂无商机数据</p>
                <p class="empty-state-subtext">点击"新增商机派单"按钮添加商机</p>
            </div>
        `;
        return;
    }
    
    // 渲染商机卡片
    filteredBusinesses.forEach(business => {
        const card = createBusinessCard(business);
        businessCards.appendChild(card);
    });
}

// 创建商机卡片
function createBusinessCard(business) {
    const card = document.createElement('div');
    card.className = `business-card priority-${business.priority} ${business.completed ? 'completed' : ''}`;
    
    const wpsLinkHtml = business.wpsLink ? `
        <div class="meta-item">
            <span class="meta-label">文档链接:</span>
            <a href="${business.wpsLink}" target="_blank" style="color: #667eea; text-decoration: none;">查看文档</a>
        </div>
    ` : '';
    
    card.innerHTML = `
        <div class="card-header">
            <div class="checkbox-wrapper">
                <input type="checkbox" class="business-checkbox" 
                       ${business.completed ? 'checked' : ''} 
                       data-id="${business.id}">
            </div>
            <div class="card-content">
                <span class="card-category">${categoryMap[business.category]}</span>
                <h3 class="card-title">${business.title}</h3>
            </div>
        </div>
        
        ${business.description ? `<p class="card-description">${business.description}</p>` : ''}
        
        <div class="card-meta">
            <div class="meta-item">
                <span class="meta-label">优先级:</span>
                <span class="priority-badge ${business.priority}">${priorityMap[business.priority]}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">状态:</span>
                <span class="status-badge ${business.status}">${statusMap[business.status]}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">负责人:</span>
                <span>${business.assignee || '未分配'}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">创建日期:</span>
                <span>${business.date}</span>
            </div>
            ${business.deadline ? `<div class="meta-item">
                <span class="meta-label">截止时间:</span>
                <span style="${business.deadline < getCurrentDate() && business.status !== 'completed' ? 'color: #ff4d4f; font-weight: bold;' : ''}">${business.deadline}</span>
            </div>` : ''}
            ${wpsLinkHtml}
        </div>
        
        <div class="card-actions">
            <button class="btn-sm btn-update" data-id="${business.id}">更新</button>
        </div>
    `;
    
    // 绑定事件
    const checkbox = card.querySelector('.business-checkbox');
    checkbox.addEventListener('change', () => toggleComplete(business.id));
    
    const updateBtn = card.querySelector('.btn-update');
    updateBtn.addEventListener('click', () => {
        const businessData = businesses.find(b => b.id === business.id);
        if (businessData) {
            openModal(businessData);
        }
    });
    
    return card;
}

// 保存到localStorage
function saveToStorage() {
    localStorage.setItem('businesses', JSON.stringify(businesses));
}

// 从localStorage加载
function loadFromStorage() {
    const stored = localStorage.getItem('businesses');
    if (stored) {
        businesses = JSON.parse(stored);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initApp);
