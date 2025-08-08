# Profile Update Guide for EduAccess

## Overview

The profile editing functionality has been enhanced to allow faculty members to update their `employee_id`, `office_location`, and `joining_date` information. These updates are saved directly to the appropriate faculty table in the database.

## How It Works

### 1. **Profile Detection**
- The system searches across all faculty tables (`ad`, `ce`, `cse`, `ece`, etc.) to find the user's record
- It identifies which table contains the user's data based on their email
- The `table_source` field tracks which table the user belongs to

### 2. **Data Update Process**
- When a faculty member edits their profile, the system:
  1. Finds their record in the correct faculty table
  2. Updates the `employee_id`, `office_location`, and `joining_date` fields
  3. Saves the changes directly to that specific table
  4. Provides feedback on success or failure

### 3. **Security & Permissions**
- **Read Access**: Anyone can view faculty directory data
- **Update Access**: Only authenticated users can update their own records
- **RLS Policies**: Row Level Security ensures proper access control

## Updated Files

### **API Layer (`api/profileApi.ts`)**
- Enhanced `fetchUserProfileByEmail()` with better logging and field mapping
- Improved `updateUserProfile()` to handle new fields properly
- Added detailed error logging and success tracking

### **UI Layer (`screens/EditProfileScreen.tsx`)**
- Added validation for required fields
- Enhanced user interface with helpful hints
- Improved error handling and user feedback
- Added display of current field values

### **Database Layer**
- Updated RLS policies to allow authenticated users to update records
- Added proper field mapping for new columns

## New Fields

### **Employee ID**
- **Purpose**: Unique identifier for faculty members
- **Format**: Alphanumeric (e.g., EMP001, F2023001)
- **Max Length**: 20 characters
- **Required**: Yes

### **Office Location**
- **Purpose**: Physical location of faculty member's office
- **Format**: Text description (e.g., "Room 205, Block A")
- **Max Length**: 100 characters
- **Required**: Yes

### **Joining Date**
- **Purpose**: Date when faculty member joined the institution
- **Format**: Text description (e.g., "15 March 2020")
- **Max Length**: 50 characters
- **Required**: Yes

## Database Schema

The new fields are added to all faculty tables:
```sql
ALTER TABLE cse ADD COLUMN employee_id VARCHAR(20);
ALTER TABLE cse ADD COLUMN office_location VARCHAR(100);
ALTER TABLE cse ADD COLUMN joining_date VARCHAR(50);
```

## RLS Policies

Updated policies allow:
- **Public read access** to all faculty data
- **Authenticated user update access** to their own records

```sql
CREATE POLICY "Enable read access for all users" ON cse FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON cse FOR UPDATE USING (auth.role() = 'authenticated');
```

## Testing

### **Manual Testing**
1. **Login** as a faculty member
2. **Navigate** to Profile → Edit Profile
3. **Fill in** the new fields:
   - Employee ID: `EMP001`
   - Office Location: `Room 205, Block A`
   - Joining Date: `15 March 2020`
4. **Save** the changes
5. **Verify** the data appears in the faculty directory

### **Database Testing**
Run the test script `test_profile_update.sql` to verify:
- Current data status in all tables
- Field availability and data counts
- Update permissions

## Error Handling

### **Common Issues**
1. **User Not Found**: Email doesn't exist in any faculty table
2. **RLS Policy Violation**: User doesn't have update permissions
3. **Database Connection**: Network or connection issues
4. **Validation Errors**: Missing required fields

### **Debugging**
- Check console logs for detailed error messages
- Verify RLS policies are properly set
- Ensure user is authenticated
- Confirm table structure has new columns

## Security Considerations

### **Data Protection**
- Only authenticated users can update records
- Updates are limited to specific fields
- No sensitive data exposure in logs
- Proper error handling prevents data leaks

### **Access Control**
- RLS policies enforce security at database level
- User can only update their own record
- Read access is public (appropriate for directory)
- Write access requires authentication

## Future Enhancements

### **Potential Improvements**
1. **Date Picker**: Replace text input with proper date picker
2. **Validation**: Add format validation for employee ID
3. **Audit Trail**: Track who updated what and when
4. **Bulk Updates**: Allow admins to update multiple records
5. **Profile Photos**: Add avatar upload functionality

### **Additional Fields**
- **Phone Extension**: Internal phone number
- **Office Hours**: Available consultation times
- **Specializations**: Areas of expertise
- **Publications**: Recent research work

## Troubleshooting

### **If Updates Don't Save**
1. **Check Authentication**: Ensure user is logged in
2. **Verify RLS Policies**: Run the RLS setup script
3. **Check Console Logs**: Look for error messages
4. **Test Database Connection**: Verify Supabase connectivity

### **If Data Doesn't Load**
1. **Check Table Structure**: Ensure new columns exist
2. **Verify RLS Policies**: Ensure read access is enabled
3. **Check User Email**: Confirm email exists in database
4. **Review Console Logs**: Look for detailed error messages

## Support

For issues with profile updates:
1. **Check the console logs** for detailed error messages
2. **Run the test scripts** to verify database setup
3. **Verify RLS policies** are properly configured
4. **Test with a known user** to isolate the issue

## Files Modified

- `api/profileApi.ts` - Enhanced profile fetching and updating
- `screens/EditProfileScreen.tsx` - Improved UI and validation
- `rls_simple.sql` - Updated RLS policies for updates
- `test_profile_update.sql` - Test script for verification
- `PROFILE_UPDATE_GUIDE.md` - This guide
