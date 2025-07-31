# eduAccess_v2

A comprehensive educational institution management app built with React Native and Supabase.

## 🚀 Features

### Core Features
- **Faculty Directory**: Complete faculty contact information with search and filtering
- **Notice Management**: Upload and manage faculty notices with PDF support
- **Hall Booking**: Room reservation system for events and meetings
- **Exam Management**: Exam duty assignments and seating arrangements
- **User Authentication**: Secure login and registration system
- **Dark/Light Theme**: Beautiful theme system with automatic switching

### AI-Powered Features
- **PDF Summary Generation**: Automatic AI-powered summaries of PDF notices using Google Gemini AI
- **Smart Search**: Search through notice content and AI-generated summaries
- **Intelligent Processing**: Extract text from PDFs and generate concise summaries

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Storage, Auth)
- **AI Integration**: Google Gemini AI for PDF summarization
- **Styling**: Tailwind CSS with NativeWind
- **Navigation**: React Navigation
- **Icons**: React Native Vector Icons

## 📱 Screenshots

[Add screenshots here]

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Supabase account
- Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eduAccess_v2_fresh
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL setup scripts in `supabase_table_setup.sql`
   - Configure storage buckets

4. Set up environment variables:
   - Copy your Supabase URL and anon key to the supabase.js file
   - Add your Gemini API key to Supabase environment variables

5. Deploy Edge Functions:
```bash
supabase functions deploy
```

6. Run the app:
```bash
npm start
```

## 🔧 AI Features Setup

For the PDF summary feature, follow the detailed setup guide:
[Faculty Notice AI Summary Setup](./FACULTY_NOTICE_AI_SUMMARY_SETUP.md)

### Quick Setup:
1. Add Gemini API key to Supabase environment variables
2. Run database migration for summary column
3. Deploy the `summarize-notice` Edge Function
4. Test the functionality

## 📁 Project Structure

```
eduAccess_v2_fresh/
├── api/                 # API functions and data fetching
├── components/          # Reusable UI components
├── screens/            # App screens
├── supabase/           # Supabase configuration and functions
│   └── functions/      # Edge Functions
├── types.ts            # TypeScript type definitions
└── README.md           # This file
```

## 🔒 Security

- All API keys stored securely in environment variables
- Server-side PDF processing in Edge Functions
- Proper CORS configuration
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section in the AI setup guide
- Review Supabase and Gemini API documentation
- Open an issue in the repository