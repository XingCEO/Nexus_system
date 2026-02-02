'use client'

import { useState, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { cn } from '@/lib/utils'

// 自定義程式碼主題 - 更現代的配色
const codeTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#e4e4e7',
    background: 'none',
    fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, "Courier New", monospace',
    fontSize: '13px',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.7',
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    color: '#e4e4e7',
    background: '#18181b',
    padding: '1rem 1.25rem',
    margin: 0,
    overflow: 'auto',
    borderRadius: 0,
  },
  comment: { color: '#6b7280', fontStyle: 'italic' },
  prolog: { color: '#6b7280' },
  doctype: { color: '#6b7280' },
  cdata: { color: '#6b7280' },
  punctuation: { color: '#a1a1aa' },
  property: { color: '#7dd3fc' },
  tag: { color: '#f472b6' },
  boolean: { color: '#c4b5fd' },
  number: { color: '#fcd34d' },
  constant: { color: '#c4b5fd' },
  symbol: { color: '#c4b5fd' },
  deleted: { color: '#fca5a5' },
  selector: { color: '#86efac' },
  'attr-name': { color: '#fcd34d' },
  string: { color: '#86efac' },
  char: { color: '#86efac' },
  builtin: { color: '#7dd3fc' },
  inserted: { color: '#86efac' },
  operator: { color: '#f472b6' },
  entity: { color: '#fcd34d', cursor: 'help' },
  url: { color: '#7dd3fc' },
  variable: { color: '#f472b6' },
  atrule: { color: '#7dd3fc' },
  'attr-value': { color: '#86efac' },
  function: { color: '#c4b5fd' },
  'class-name': { color: '#fcd34d' },
  keyword: { color: '#f472b6' },
  regex: { color: '#fcd34d' },
  important: { color: '#f472b6', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  isStreaming?: boolean
}

interface ChatMessageProps {
  message: Message
  isLatest?: boolean
  onRegenerate?: () => void
  onRegenerateWithModel?: (model: string) => void
}

// 可用模型列表
const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'llama3', name: 'Llama 3', provider: '本機' },
  { id: 'local', name: 'LM Studio', provider: '本機' },
]

// 複製按鈕組件 (程式碼區塊用)
function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
        copied
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-400 hover:text-zinc-300"
      )}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          已複製
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          複製
        </>
      )}
    </button>
  )
}

// 訊息操作按鈕組件
function MessageActions({
  content,
  onRegenerate,
  onRegenerateWithModel,
}: {
  content: string
  onRegenerate?: () => void
  onRegenerateWithModel?: (model: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
      {/* 複製按鈕 */}
      <button
        onClick={handleCopy}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
          copied
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            已複製
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            複製
          </>
        )}
      </button>

      {/* 重新生成按鈕 */}
      <button
        onClick={onRegenerate}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重新生成
      </button>

      {/* 換模型重新生成 */}
      <div className="relative">
        <button
          onClick={() => setShowModelMenu(!showModelMenu)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          換模型
        </button>

        {/* 模型選單 */}
        {showModelMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowModelMenu(false)}
            />
            <div className="absolute bottom-full left-0 mb-2 w-56 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                選擇模型重新生成
              </div>
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onRegenerateWithModel?.(model.id)
                    setShowModelMenu(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{model.name}</span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    {model.provider}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 分隔線 */}
      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

      {/* 讚/踩按鈕 */}
      <button
        onClick={() => setLiked(liked === true ? null : true)}
        className={cn(
          "p-1.5 rounded-lg transition-all duration-200",
          liked === true
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
      >
        <svg className="w-4 h-4" fill={liked === true ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      </button>
      <button
        onClick={() => setLiked(liked === false ? null : false)}
        className={cn(
          "p-1.5 rounded-lg transition-all duration-200",
          liked === false
            ? "text-red-600 dark:text-red-400 bg-red-500/10"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
      >
        <svg className="w-4 h-4" fill={liked === false ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
      </button>

      {/* 更多選項 */}
      <button
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ml-auto"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </button>
    </div>
  )
}

// 語言圖標
function LanguageIcon({ lang }: { lang: string }) {
  const iconMap: Record<string, { color: string; label: string }> = {
    javascript: { color: '#f7df1e', label: 'JS' },
    js: { color: '#f7df1e', label: 'JS' },
    typescript: { color: '#3178c6', label: 'TS' },
    ts: { color: '#3178c6', label: 'TS' },
    tsx: { color: '#3178c6', label: 'TSX' },
    jsx: { color: '#61dafb', label: 'JSX' },
    python: { color: '#3776ab', label: 'PY' },
    py: { color: '#3776ab', label: 'PY' },
    rust: { color: '#dea584', label: 'RS' },
    go: { color: '#00add8', label: 'GO' },
    java: { color: '#ed8b00', label: 'JAVA' },
    cpp: { color: '#00599c', label: 'C++' },
    c: { color: '#a8b9cc', label: 'C' },
    html: { color: '#e34f26', label: 'HTML' },
    css: { color: '#1572b6', label: 'CSS' },
    json: { color: '#292929', label: 'JSON' },
    bash: { color: '#4eaa25', label: 'BASH' },
    shell: { color: '#4eaa25', label: 'SH' },
    sql: { color: '#e38c00', label: 'SQL' },
    yaml: { color: '#cb171e', label: 'YAML' },
    markdown: { color: '#083fa1', label: 'MD' },
    md: { color: '#083fa1', label: 'MD' },
  }

  const info = iconMap[lang.toLowerCase()] || { color: '#6b7280', label: lang.toUpperCase().slice(0, 4) }

  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: info.color }}
      />
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {info.label}
      </span>
    </div>
  )
}

// Markdown 渲染組件
const MarkdownContent = memo(function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 程式碼區塊
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')
          const isInline = !match && !codeString.includes('\n')

          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 text-[13px] font-mono font-medium"
                {...props}
              >
                {children}
              </code>
            )
          }

          const language = match ? match[1] : 'text'

          return (
            <div className="group relative my-5 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#18181b] shadow-lg">
              {/* 標題列 */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                <LanguageIcon lang={language} />
                <CodeCopyButton code={codeString} />
              </div>
              {/* 程式碼內容 */}
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  style={codeTheme}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: '1rem 1.25rem',
                    fontSize: '13px',
                    lineHeight: '1.7',
                    background: '#18181b',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, monospace',
                    }
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          )
        },
        // 段落
        p({ children }) {
          return <p className="mb-4 last:mb-0 leading-[1.8] text-zinc-700 dark:text-zinc-300">{children}</p>
        },
        // 標題
        h1({ children }) {
          return <h1 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">{children}</h1>
        },
        h2({ children }) {
          return <h2 className="text-xl font-semibold mt-6 mb-3 text-zinc-900 dark:text-zinc-100">{children}</h2>
        },
        h3({ children }) {
          return <h3 className="text-lg font-semibold mt-5 mb-2 text-zinc-900 dark:text-zinc-100">{children}</h3>
        },
        h4({ children }) {
          return <h4 className="text-base font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-100">{children}</h4>
        },
        // 列表
        ul({ children }) {
          return <ul className="mb-4 ml-1 space-y-2">{children}</ul>
        },
        ol({ children }) {
          return <ol className="mb-4 ml-1 space-y-2 list-decimal list-inside">{children}</ol>
        },
        li({ children }) {
          return (
            <li className="flex items-start gap-2 leading-[1.8] text-zinc-700 dark:text-zinc-300">
              <span className="text-zinc-400 dark:text-zinc-600 mt-2">•</span>
              <span className="flex-1">{children}</span>
            </li>
          )
        },
        // 連結
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-blue-600/30 dark:decoration-blue-400/30 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
            >
              {children}
            </a>
          )
        },
        // 引用
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 my-5 py-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-r-lg text-zinc-600 dark:text-zinc-400 italic">
              {children}
            </blockquote>
          )
        },
        // 水平線
        hr() {
          return <hr className="my-8 border-zinc-200 dark:border-zinc-800" />
        },
        // 表格
        table({ children }) {
          return (
            <div className="my-5 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                {children}
              </table>
            </div>
          )
        },
        thead({ children }) {
          return <thead className="bg-zinc-100 dark:bg-zinc-900">{children}</thead>
        },
        th({ children }) {
          return <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{children}</th>
        },
        tbody({ children }) {
          return <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/50">{children}</tbody>
        },
        td({ children }) {
          return <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{children}</td>
        },
        // 粗體
        strong({ children }) {
          return <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>
        },
        // 斜體
        em({ children }) {
          return <em className="italic text-zinc-600 dark:text-zinc-400">{children}</em>
        },
        // 刪除線
        del({ children }) {
          return <del className="text-zinc-500 line-through">{children}</del>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
})

export function ChatMessage({ message, isLatest, onRegenerate, onRegenerateWithModel }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming

  return (
    <div className={cn('py-6', isLatest && 'animate-enter')}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm',
              isUser
                ? 'bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 text-zinc-600 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700'
                : 'bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-zinc-200 text-zinc-100 dark:text-zinc-800 ring-1 ring-zinc-700 dark:ring-zinc-300'
            )}
          >
            {isUser ? '你' : 'S'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-[15px]">
          {isUser ? (
            <p className="leading-[1.8] whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{message.content}</p>
          ) : (
            <div className="prose-container">
              {message.content ? (
                <>
                  <MarkdownContent content={message.content} />
                  {isStreaming && (
                    <span className="inline-block w-0.5 h-5 ml-0.5 bg-zinc-400 dark:bg-zinc-500 animate-pulse align-text-bottom" />
                  )}
                  {/* 操作按鈕 - 只在非串流時顯示 */}
                  {!isStreaming && (
                    <MessageActions
                      content={message.content}
                      onRegenerate={onRegenerate}
                      onRegenerateWithModel={onRegenerateWithModel}
                    />
                  )}
                </>
              ) : isStreaming ? (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
