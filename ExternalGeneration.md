# External Generation

这个文件是给 ChatGPT 网页版用的外部生成模板。

目标：
- 让网页版直接产出严格 JSON
- JSON 里包含每个小节的 `main`、`summary`、`quiz`
- 严格按请求语言输出，不混用中英文
- 你把结果复制回来后，我就可以更快地把它接成 example 课程内容

## 使用方法

1. 复制下面整段提示词到 ChatGPT 网页版。
2. 把里面的占位符替换成你的课程信息。
3. 要求网页版只返回原始 JSON，不要加解释，不要加代码块。
4. 把返回结果直接贴回给我。

## 推荐模板

```text
You are generating structured learning content for a course platform.

Your task:
- Generate course content in strict JSON only
- Do not include any explanation before or after the JSON
- Do not wrap the JSON in markdown code fences
- Preserve the exact chapter titles and subchapter titles I provide
- Output must be valid JSON

Content requirements:
- The content must be educational, detailed, specific, and concept-focused
- Do NOT include project-based instructions
- Do NOT include implementation code
- Do NOT include teacher notes or meta commentary
- Make the writing suitable for a learning platform UI
- Use clear sectioned markdown inside the `main` and `summary` fields
- The quality bar should match a full formal course, not a shortened sample course
- The writing must feel complete enough that a learner would treat it as a real course
- If `language` is `zh`, all human-readable content must be in Chinese
- If `language` is `en`, all human-readable content must be in English
- Never mix Chinese and English in lesson prose
- Do not make the lesson longer by adding many extra section headings
- Keep the structure compact, but make the content under each section much more detailed and specific

Lesson requirements for each subchapter:
- `main` should be a very detailed and specific lesson body in markdown
- `summary` should be a detailed and specific review in markdown, not a short recap
- Depth should come from richer explanation under each section, not from adding many new sections
- `quiz` must contain exactly 5 questions
- Each quiz question must have exactly 4 options
- `correct_answer_index` must be 0, 1, 2, or 3
- Each quiz question must include a short explanation
- Wrong options should be plausible, not obviously silly
- `main` should be significantly longer than `summary`

Return JSON in exactly this shape:
{
  "course_title": "",
  "language": "zh",
  "chapters": [
    {
      "title": "",
      "subchapters": [
        {
          "title": "",
          "main": "",
          "summary": "",
          "quiz": {
            "questions": [
              {
                "question": "",
                "options": ["", "", "", ""],
                "correct_answer_index": 0,
                "explanation": ""
              }
            ]
          }
        }
      ]
    }
  ]
}

Additional rules:
- Keep chapter order exactly as given
- Keep subchapter order exactly as given
- Keep the chapter and subchapter titles exactly as given
- Do not add or remove chapters
- Do not add or remove subchapters
- Escape newlines correctly so the output remains valid JSON
- Put markdown content inside JSON strings
- Keep title language consistent with the requested `language`
- Keep `course_title`, chapter titles, and subchapter titles in the requested language version

Course title:
<COURSE_TITLE>

Language:
<LANGUAGE>

Course positioning:
<COURSE_POSITIONING>

Course goals:
<COURSE_GOALS>

Chapters and subchapters:
<CHAPTERS_AND_SUBCHAPTERS>
```

## 占位符建议

- `<COURSE_TITLE>`：课程总标题
- `<LANGUAGE>`：通常填 `zh` 或 `en`
- `<COURSE_POSITIONING>`：一句话说明课程定位，比如“面向学习平台的概念型课程，不包含代码实现”
- `<COURSE_GOALS>`：3 到 5 条课程目标
- `<CHAPTERS_AND_SUBCHAPTERS>`：按下面这种格式列出来

```text
Chapter 1: ...
- Subchapter 1: ...
- Subchapter 2: ...
- Subchapter 3: ...
- Subchapter 4: ...

Chapter 2: ...
- Subchapter 1: ...
- Subchapter 2: ...
```

## 回传给我的建议

你把网页版结果贴回来的时候，最好直接说：

```text
请把这个 JSON 接成 example 课程内容，slug 用 <COURSE_SLUG>。
```

如果你已经有固定 slug，也可以一起告诉我，我就直接按那个 slug 接进去。
