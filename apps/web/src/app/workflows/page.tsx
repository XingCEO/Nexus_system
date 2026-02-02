'use client'

import { WorkflowEditor } from '@/components/workflow/WorkflowEditor'
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader'
import { AuthGuard } from '@/components/AuthGuard'

export default function WorkflowsPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col">
        <WorkflowHeader />
        <main className="flex-1 overflow-hidden">
          <WorkflowEditor />
        </main>
      </div>
    </AuthGuard>
  )
}
