#!/usr/bin/env python3
"""
EmailJS Setup Helper
Guides you through configuring EmailJS for your portfolio
"""

import sys
import os

def update_script_js(service_id, template_id):
    """Update script.js with the provided credentials"""
    script_path = "script.js"
    
    if not os.path.exists(script_path):
        print(f"\n✗ Error: {script_path} not found in current directory")
        return
    
    try:
        with open(script_path, 'r') as f:
            content = f.read()
        
        # Replace placeholders
        updated = content.replace("'YOUR_SERVICE_ID_HERE'", f"'{service_id}'")
        updated = updated.replace("'YOUR_TEMPLATE_ID_HERE'", f"'{template_id}'")
        
        with open(script_path, 'w') as f:
            f.write(updated)
        
        print(f"\n✓ Successfully updated {script_path}")
        print("\nYour portfolio is now ready for GitHub.dev!")
        print("Test it by opening your portfolio and sending a test message.")
        
    except Exception as e:
        print(f"\n✗ Error updating {script_path}: {e}")
        sys.exit(1)

def main():
    print("\n" + "="*50)
    print("EmailJS Portfolio Setup Helper")
    print("="*50 + "\n")

    print("✓ Public Key already configured:")
    print("  ihlv_qkqYTcY_gCw7\n")

    print("=" * 50)
    print("STEP 1: Get Your Service ID")
    print("=" * 50)
    print("1. Open: https://dashboard.emailjs.com/admin/services")
    print("2. Look for your Gmail service (should be connected)")
    print("3. Copy the Service ID (format: service_xxxxxxxxxxxx)")
    print("4. Paste it below:\n")

    service_id = input("Enter Service ID: ").strip()

    print("\n" + "=" * 50)
    print("STEP 2: Get Your Template ID")
    print("=" * 50)
    print("1. Open: https://dashboard.emailjs.com/admin/templates")
    print("2. Look for your portfolio template")
    print("3. Copy the Template ID")
    print("4. Paste it below:\n")

    template_id = input("Enter Template ID: ").strip()

    print("\n" + "=" * 50)
    print("CONFIGURATION SUMMARY")
    print("=" * 50)
    print(f"Public Key:  ihlv_qkqYTcY_gCw7")
    print(f"Service ID:  {service_id}")
    print(f"Template ID: {template_id}")

    if service_id and template_id:
        print("\n✓ Configuration complete!")
        print("\nUpdate your script.js with these values:")
        print(f"\n  emailjs.send(")
        print(f"    '{service_id}',")
        print(f"    '{template_id}',")
        print(f"    {{\n        from_name: data.name,")
        print(f"        from_email: data.email,")
        print(f"        message: data.message,")
        print(f"        to_email: 'habiballahportfolioweb@gmail.com'")
        print(f"    }}")
        print(f"  )")
        
        # Offer to update script.js
        print("\nWould you like me to update script.js automatically? (y/n)")
        response = input("> ").strip().lower()
        
        if response == 'y':
            update_script_js(service_id, template_id)
    else:
        print("\n✗ Error: Missing credentials. Please try again.")
        sys.exit(1)

    print("\n")

if __name__ == "__main__":
    main()
