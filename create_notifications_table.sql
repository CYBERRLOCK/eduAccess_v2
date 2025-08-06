-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'alert', 'success', 'warning')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow all authenticated users to read notifications
CREATE POLICY "Allow authenticated users to read notifications" ON public.notifications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert notifications
CREATE POLICY "Allow authenticated users to insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update notifications (for marking as read)
CREATE POLICY "Allow authenticated users to update notifications" ON public.notifications
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON public.notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 