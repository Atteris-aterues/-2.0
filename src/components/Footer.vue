<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-brand footer-animate">
          <img src="../assets/logo.png" alt="Damai Logo" class="footer-logo">
          <p class="brand-slogan">全球演出赛事购票平台</p>
        </div>
        
        <div class="footer-links-grid">
          <div class="link-group footer-animate">
            <h4>帮助中心</h4>
            <ul>
              <li><a href="#">预订答疑</a></li>
              <li><a href="#">退票退款</a></li>
              <li><a href="#">配送方式</a></li>
              <li><a href="#">支付方式</a></li>
            </ul>
          </div>
          <div class="link-group footer-animate">
            <h4>关于大麦</h4>
            <ul>
              <li><a href="#">公司介绍</a></li>
              <li><a href="#">品牌识别</a></li>
              <li><a href="#">企业文化</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>
          <div class="link-group footer-animate">
            <h4>商务合作</h4>
            <ul>
              <li><a href="#">演出合作</a></li>
              <li><a href="#">广告投放</a></li>
              <li><a href="#">开放平台</a></li>
              <li><a href="#">供应商入驻</a></li>
            </ul>
          </div>
          <div class="link-group footer-animate">
            <h4>关注我们</h4>
            <div class="social-icons">
              <el-tooltip content="官方微博" placement="top">
                <div class="social-item">WB</div>
              </el-tooltip>
              <el-tooltip content="官方微信" placement="top">
                <div class="social-item">WX</div>
              </el-tooltip>
              <el-tooltip content="手机应用" placement="top">
                <div class="social-item">APP</div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom footer-animate">
        <div class="copyright">
          <p>© 2021-2026 Damai All Rights Reserved 版权所有</p>
          <div class="legal-links">
            <span>京ICP备12345678号</span>
            <span>京公网安备11010102000001号</span>
          </div>
        </div>
        <div class="footer-tagline">
          每一场演出，都是一次生命的庆典
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger

    // 注册插件
    gsap.registerPlugin(ScrollTrigger)

    // 创建底部动画
    gsap.from('.footer-animate', {
      scrollTrigger: {
        trigger: '.main-footer',
        start: 'top 90%', // 当 footer 进入视图 90% 时触发
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2, // 依次交错显示
      ease: 'power3.out'
    })

    // 社交图标悬停效果
    const icons = document.querySelectorAll('.social-item')
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          y: -5,
          backgroundColor: '#ff1268',
          borderColor: '#ff1268',
          scale: 1.1,
          duration: 0.3
        })
      })
      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          y: 0,
          backgroundColor: 'transparent',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          scale: 1,
          duration: 0.3
        })
      })
    })
  }
})
</script>

<style scoped>
.main-footer {
  background-color: var(--card-bg);
  border-top: 1px solid var(--glass-border);
  padding: 80px 0 40px;
  margin-top: 100px;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  gap: 60px;
}

.footer-brand {
  flex: 0 0 240px;
}

.footer-logo {
  height: 40px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.brand-slogan {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.footer-links-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.link-group h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-color);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group ul li {
  margin-bottom: 12px;
}

.link-group ul li a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.link-group ul li a:hover {
  color: #ff1268;
  padding-left: 5px;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-item {
  width: 36px;
  height: 36px;
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright p {
  color: var(--text-secondary);
  opacity: 0.6;
  font-size: 13px;
  margin-bottom: 8px;
}

.legal-links {
  display: flex;
  gap: 20px;
  color: var(--text-secondary);
  opacity: 0.4;
  font-size: 12px;
}

.footer-tagline {
  font-size: 14px;
  font-style: italic;
  background: linear-gradient(135deg, #ff1268, #ff5277);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}

@media (max-width: 992px) {
  .footer-top {
    flex-direction: column;
    gap: 40px;
  }
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .footer-links-grid {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
