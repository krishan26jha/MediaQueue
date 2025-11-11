import { NextResponse } from 'next/server';
import { notificationService } from '@/lib/services/notificationService';

// GET notifications for a user
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const notifications = await notificationService.getUserNotifications(userId);
    
    return NextResponse.json({
      notifications,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST to create a notification
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, title, message, type } = data;
    
    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const notification = await notificationService.createNotification(
      userId,
      title,
      message,
      type
    );
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Notification created',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PATCH to mark notifications as read
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { userId, notificationId } = data;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // If notificationId is provided, mark specific notification as read
    if (notificationId) {
      const success = await notificationService.markAsRead(notificationId);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Notification not found or could not be updated' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Notification marked as read',
        success: true
      });
    }
    
    // Otherwise, mark all notifications as read
    const count = await notificationService.markAllAsRead(userId);
    
    return NextResponse.json({
      message: `${count} notifications marked as read`,
      success: true,
      count
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
} 