'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageSquare, 
  Plus,
  MoreVertical,
  Trash2,
  Settings
} from 'lucide-react'
import { ChatInterface } from '@/components/ChatInterface'
import { useQuery } from 'react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pdf?: {
    id: string
    title: string
  }
}

interface UserChats {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pdf?: {
    id: string
    title: string
  }
}

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string
  
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chatId)

  const { data: chat, isLoading: chatLoading } = useQuery<Chat>(
    ['chat', chatId],
    async () => {
      const response = await fetch(`/api/chat/${chatId}`)
      if (!response.ok) throw new Error('Failed to fetch chat')
      return response.json()
    },
    {
      enabled: !!chatId
    }
  )

  const { data: userChats, isLoading: chatsLoading } = useQuery<UserChats[]>(
    'user-chats',
    async () => {
      const response = await fetch('/api/chat/list')
      if (!response.ok) throw new Error('Failed to fetch chats')
      return response.json()
    }
  )

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Chat',
        }),
      })

      if (!response.ok) throw new Error('Failed to create new chat')

      const result = await response.json()
      setSelectedChatId(result.chat.id)
      toast.success('New chat created!')
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast.error('Failed to create new chat')
    }
  }

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      const response = await fetch(`/api/chat/${chatIdToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete chat')

      toast.success('Chat deleted successfully')
      // Refresh chats list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error('Failed to delete chat')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (chatLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Not Found</h1>
          <p className="text-gray-600 mb-6">The requested chat could not be found.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {chat.title}
                </h1>
                {chat.pdf && (
                  <p className="text-sm text-gray-500">
                    PDF: {chat.pdf.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Chats</h3>
              <div className="space-y-2">
                {chatsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  userChats?.map((userChat) => (
                    <div
                      key={userChat.id}
                      onClick={() => setSelectedChatId(userChat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChatId === userChat.id
                          ? 'bg-primary-50 border border-primary-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userChat.title}
                          </p>
                          {userChat.pdf && (
                            <p className="text-xs text-gray-500 truncate">
                              {userChat.pdf.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {formatDate(userChat.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(userChat.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            chatId={selectedChatId}
            onChatCreated={setSelectedChatId}
            pdfId={chat.pdf?.id || ''}
            pdfTitle={chat.pdf?.title || ''}
          />
        </div>
      </div>
    </div>
  )
}
