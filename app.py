from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
import base64
import os
import sqlite3
from datetime import datetime
from config import Config

# Initialize Flask app
app = Flask(__name__)

# Initialize database
def init_db():
    conn = sqlite3.connect('game_history.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS history
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  image_data TEXT NOT NULL,
                  ai_guess TEXT NOT NULL,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

# Initialize OpenAI client
client = OpenAI(
    base_url=Config.BASE_URL,
    api_key=Config.API_KEY,
)

# Endpoint to handle AI guessing
@app.route('/guess', methods=['POST'])
def guess():
    try:
        # Get the image file from the request
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({'error': 'No image provided'}), 400

        # Read the image file
        image_bytes = image_file.read()

        # Encode image to base64
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')

        # Prepare the prompt for Qwen
        prompt = """
你是一个专业的图像识别AI，专门为"我画你猜"游戏设计。

## 核心任务
识别用户手绘简笔画中的核心物体，直接输出生活中常见事物的中文名称。

## 识别规则
1. **只识别最主要的核心物体**（如果画面中有多个物体）
2. **输出格式**：单个中文名词，不带任何标点符号和修饰词
3. **内容要求**：必须是日常生活中常见的具体物品
4. **回答方式**：直接输出名称，不解释、不描述、不猜测

## 优先识别类别（按重要性排序）
- 基础物品：苹果、香蕉、橘子、西瓜、草莓
- 动物：猫、狗、鸟、鱼、兔子、大象、狮子
- 交通工具：汽车、飞机、船、自行车、火车
- 日用品：手机、电脑、书、花瓶、雨伞、帽子
- 建筑/场所：房子、学校、医院、商店、公园
- 人体部位：眼睛、鼻子、嘴巴、手、脚
- 其他常见物：太阳、月亮、星星、树、花

## 特殊情况处理
- 图像模糊或无法识别：输出"无法识别"
- 线条过于抽象或不完整：输出"无法识别"
- 明显不是物体的涂鸦：输出"无法识别"
- 多个物体难以判断主次：选择最完整清晰的一个

## 输出示例
✅ 正确输出：
苹果
汽车
猫
房子
太阳

❌ 错误输出：
"这可能是苹果"
一个房子
像是狗之类的
不确定是什么

## 注意事项
- 绝对不要添加任何标点符号
- 绝对不要添加"可能"、"好像"等不确定词汇
- 绝对不要输出句子或短语
- 识别准确度不够时宁可输出"无法识别"
- 保持回答的简洁性和准确性

请严格按照以上规则执行识别任务。
"""

        # Call Qwen API
        response = client.chat.completions.create(
            model=Config.MODEL,
            messages=[{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt},
                    {
                        'type': 'image_url',
                        'image_url': {
                            'url': f'data:image/png;base64,{encoded_image}'
                        }
                    }
                ]
            }],
            stream=False
        )

        # Extract the description from the response
        description = response.choices[0].message.content

        # Save to database
        conn = sqlite3.connect('game_history.db')
        c = conn.cursor()
        c.execute("INSERT INTO history (image_data, ai_guess) VALUES (?, ?)",
                  (f"data:image/png;base64,{encoded_image}", description))
        conn.commit()
        conn.close()

        # Return the description
        return jsonify({'description': description})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to process the image'}), 500

# Endpoint to get game history
@app.route('/history', methods=['GET'])
def get_history():
    try:
        conn = sqlite3.connect('game_history.db')
        c = conn.cursor()
        c.execute("SELECT id, image_data, ai_guess, timestamp FROM history ORDER BY timestamp DESC")
        rows = c.fetchall()
        conn.close()

        history = [{'id': row[0], 'image_data': row[1], 'ai_guess': row[2], 'timestamp': row[3]} for row in rows]
        return jsonify({'history': history})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to retrieve history'}), 500

# Endpoint to clear game history
@app.route('/clear_history', methods=['POST'])
def clear_history():
    try:
        conn = sqlite3.connect('game_history.db')
        c = conn.cursor()
        c.execute("DELETE FROM history")
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to clear history'}), 500

# Endpoint to delete a single history record
@app.route('/delete_history/<int:record_id>', methods=['POST'])
def delete_history_record(record_id):
    try:
        conn = sqlite3.connect('game_history.db')
        c = conn.cursor()
        c.execute("DELETE FROM history WHERE id = ?", (record_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to delete history record'}), 500

# Serve frontend files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Run the app
if __name__ == '__main__':
    init_db()
    app.run(debug=True)