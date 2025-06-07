#!/bin/bash

# Your provided SESSION_SECRET
SESSION_SECRET="4b2d19bf5112939f3c1ca2396c081de2ddf0f3327e47559352ed76ee251c7824"

echo "🔐 Setting up SESSION_SECRET for SmartFlow-QATRA..."
echo ""

# Validate session secret
if [ -z "$SESSION_SECRET" ]; then
    echo "❌ SESSION_SECRET is empty"
    exit 1
fi

if [ ${#SESSION_SECRET} -lt 32 ]; then
    echo "❌ SESSION_SECRET should be at least 32 characters long"
    exit 1
fi

echo "✅ SESSION_SECRET is valid"

# Create or update .env file
ENV_FILE=".env"
SESSION_SECRET_LINE="SESSION_SECRET=$SESSION_SECRET"

if [ -f "$ENV_FILE" ]; then
    echo "📝 Found existing .env file"
    
    # Check if SESSION_SECRET already exists
    if grep -q "^SESSION_SECRET=" "$ENV_FILE"; then
        # Replace existing SESSION_SECRET
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/^SESSION_SECRET=.*/$SESSION_SECRET_LINE/" "$ENV_FILE"
        else
            # Linux
            sed -i "s/^SESSION_SECRET=.*/$SESSION_SECRET_LINE/" "$ENV_FILE"
        fi
        echo "🔄 Updated existing SESSION_SECRET"
    else
        # Add new SESSION_SECRET
        echo "$SESSION_SECRET_LINE" >> "$ENV_FILE"
        echo "➕ Added new SESSION_SECRET"
    fi
else
    echo "📝 Creating new .env file"
    echo "$SESSION_SECRET_LINE" > "$ENV_FILE"
fi

echo "✅ .env file updated successfully"
echo ""
echo "🎉 SESSION_SECRET setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. For Vercel deployment:"
echo "   vercel env add SESSION_SECRET"
echo "   (Enter the value when prompted)"
echo ""
echo "2. For other platforms, add this environment variable:"
echo "   SESSION_SECRET=$SESSION_SECRET"
echo ""
echo "3. Restart your development server to use the new secret"
