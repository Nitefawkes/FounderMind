import { NextRequest, NextResponse } from 'next/server'
import { BoardMeeting, type BoardMeetingTopic } from '@/lib/ai/BoardMeeting'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { context, topic, type = 'review' } = body

    if (!context || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: context, topic' },
        { status: 400 }
      )
    }

    const meetingTopic: BoardMeetingTopic = {
      title: topic.title || topic,
      description: topic.description || '',
      type: type,
    }

    const meeting = new BoardMeeting(context)
    const messages = await meeting.startMeeting(meetingTopic)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error in board meeting:', error)
    return NextResponse.json(
      { error: 'Failed to conduct board meeting' },
      { status: 500 }
    )
  }
}
