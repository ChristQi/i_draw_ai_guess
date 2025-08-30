# I Draw, AI Guess - 赛博朋克风格"我画你猜"游戏

这是一个基于 Flask 和视觉理解大模型的 Web 应用，实现了赛博朋克风格的"我画你猜"游戏。玩家可以在画布上绘制图像，AI 会尝试识别图像内容。

## 功能特性

- **赛博朋克风格界面**: 独特的视觉设计，带有霓虹效果和动画。
- **多种游戏模式**:
  - 自由模式: 绘制任何内容，让 AI 猜测。
  - 猜词模式: 根据系统提示词进行绘制。
- **丰富的绘图工具**:
  - 画笔、橡皮擦、虚线工具
  - 多种颜色和笔刷大小
  - 上传图片功能
- **智能 AI 识别**: 使用兼容 OpenAI API 的视觉理解大模型进行图像识别。
- **游戏历史记录**: 保存绘画历史和 AI 猜测结果。
- **统计系统**: 记录胜率和游戏数据，并根据胜率显示不同等级。

## 技术栈

- **后端**: Python, Flask
- **前端**: HTML5, CSS3, JavaScript (ES6)
- **AI 模型**: 兼容 OpenAI API 的视觉理解大模型
- **数据库**: SQLite
- **依赖管理**: pip, virtual environment

## 安装与运行

### 环境要求

- Python 3.7 或更高版本
- pip 包管理器

### 安装步骤

1. **克隆仓库**:
   ```bash
   git clone https://github.com/your-username/i_draw_ai_guess.git
   cd i_draw_ai_guess
   ```

2. **（推荐）创建并激活虚拟环境**:
   - Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

3. **安装依赖**:
   ```bash
   pip install -r requirements.txt
   ```

4. **配置环境变量**:
   - 复制 `.env.example` 文件为 `.env`:
     ```bash
     cp .env.example .env
     ```
   - 编辑 `.env` 文件，填入你的视觉理解大模型 API 配置:
     ```
     BASE_URL=your_api_base_url_here
     API_KEY=your_api_key_here
     MODEL=your_model_name_here
     ```
   - **推荐使用 [ModelScope API-Inference](https://modelscope.cn/docs/model-service/API-Inference/intro)，提供每天2000次免费调用，畅玩这个游戏。**

5. **运行应用**:
   ```bash
   python app.py
   ```

6. **访问应用**:
   打开浏览器访问 `http://127.0.0.1:5000`

## 项目结构

```
i_draw_ai_guess/
├── app.py              # Flask 应用主文件
├── config.py           # 配置文件
├── requirements.txt    # Python 依赖
├── .env.example        # 环境变量示例文件
├── .gitignore          # Git 忽略文件
├── README.md           # 项目说明文件
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端 JavaScript 逻辑
└── LICENSE             # 许可证文件
```

## 使用说明

1. 选择游戏模式 (自由模式或猜词模式)。
2. 使用左侧工具栏选择绘图工具、颜色和笔刷大小。
3. 在画布上绘制图像。
4. 点击"AI猜猜看"按钮，等待 AI 识别结果。
5. 在自由模式下，可以对 AI 的猜测结果进行反馈。
6. 在猜词模式下，AI 会判断你的绘制是否与提示词匹配。
7. 查看游戏历史记录和统计数据。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

[MIT License](LICENSE)

## 致谢

- [Qwen3-Coder](https://github.com/QwenLM/qwen-code?tab=readme-ov-file) - 强大的 AI 模型支持
- [ModelScope](https://modelscope.cn/) - 模型开放平台
- [OpenAI](https://openai.com/) - API 规范
- [Flask](https://flask.palletsprojects.com/) - Python Web 框架