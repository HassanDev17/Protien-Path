### 2. Install Dependencies

npm install
- **Curity (RLS)**: Database policies ensure users can only access their own meal data
- **Environment Variables**: Sensitive keys are stored securely and never committed
- **Session Persistence**: Secure session storage with automatic token refresh
- **User Isolation**: Each user's data is completely isolated using `user_id` foreign keys

## 🎯 Usage

1. **Sign Up / Log In**: Create an account or log in with your existing credentials
2. **Set Your Goals**: Click the target icon to set your daily macro targets
3. **Add a Meal**: 
   - Click the "+" button
   - Take a photo or upload an image of your meal
   - Optionally add a text description
   - Click "Save Meal" - AI will analyze and extract nutrition data
4. **Track Progress**: View your daily progress on the dashboard
5. **Navigate Dates**: Use the date picker to view meals from previous days
6. **View Details**: Click any meal card to see detailed macro breakdown

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the powerful GPT-4o-mini vision API
- [Supabase](https://supabase.com) for the backend infrastructure
- [Vercel](https://vercel.com) for deployment platform
- All the amazing open-source libraries that made this possible

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for better nutrition tracking
