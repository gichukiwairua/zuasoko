# Admin Guide

Comprehensive guide for administrators managing the Zuasoko platform.

## 🚀 Admin Portal Overview

The admin portal provides complete control over the Zuasoko platform, including user management, content moderation, payment processing, and system analytics.

### Accessing the Admin Portal

1. **Login URL**: `/admin/dashboard` or `/auth/login?role=admin`
2. **Admin Credentials**: Contact system administrator for access
3. **Security**: Admin accounts require strong authentication

## 🏠 Dashboard Overview

### Key Metrics Display

- **Total Users**: Active farmers, customers, drivers
- **Orders Today**: Current day's order volume
- **Revenue**: Daily, weekly, monthly earnings
- **Pending Approvals**: Items requiring admin action

### Quick Actions

- Approve pending consignments
- Process payment requests
- View recent orders
- Manage user accounts

### Recent Activity Feed

- New user registrations
- Consignment submissions
- Payment transactions
- System alerts

## 👥 User Management

Access: **Admin Dashboard → Users**

### User Overview

- **Total Users**: Platform-wide user count
- **Active Users**: Currently active accounts
- **Pending Users**: Accounts awaiting activation
- **Suspended Users**: Temporarily disabled accounts

### Managing User Accounts

#### User Search & Filtering

1. **Search Options**:
   - Name, email, or phone number
   - User role (Farmer, Customer, Driver, Admin)
   - Account status
   - Registration date range

2. **Filter Controls**:
   - Role-based filtering
   - Status filtering (Active, Suspended, Pending)
   - Location-based filtering

#### User Account Actions

**For All Users**:

- 👁️ **View Profile**: Complete user information
- ✏️ **Edit Details**: Modify user information
- 🔄 **Change Status**: Activate, suspend, or delete
- 📧 **Send Message**: Direct communication

**For Farmers**:

- 💰 **Initiate Payment**: Send STK push for activation
- 📊 **View Statistics**: Sales, consignments, performance
- 🏪 **Manage Products**: View and moderate listings

**For Drivers**:

- ✅ **Approve Application**: Verify and activate drivers
- 📍 **Assign Routes**: Manage delivery assignments
- ⭐ **View Performance**: Ratings and delivery history

### Farmer Subscription Management

#### Subscription Status Types

- **🟢 Paid**: Active, paid accounts
- **🟡 Pending**: Awaiting payment activation
- **🔴 Failed**: Payment failed or expired
- **🟠 Overdue**: Payment deadline passed

#### Payment Processing

1. **Manual STK Push Initiation**:
   - Select farmer with pending payment
   - Click "Initiate Payment" button
   - Confirm M-Pesa details
   - Send STK push notification
   - Monitor payment status

2. **Payment Tracking**:
   - Real-time payment status updates
   - Transaction ID tracking
   - M-Pesa receipt verification
   - Automatic account activation

3. **Revenue Analytics**:
   - Total revenue from subscriptions
   - Monthly payment trends
   - Failed payment analysis
   - Subscription renewal rates

## 📦 Consignment Management

Access: **Admin Dashboard → Consignments**

### Consignment Review Process

#### Pending Consignments

1. **Review Queue**: All submitted consignments awaiting approval
2. **Priority System**: Urgent submissions highlighted
3. **Bulk Actions**: Approve or reject multiple items

#### Consignment Details Review

- **Product Information**: Name, category, description
- **Farmer Details**: Profile, location, history
- **Quality Assessment**: Photos, descriptions, standards
- **Pricing Analysis**: Market comparison, reasonableness
- **Location Verification**: GPS coordinates, farm location

#### Approval Actions

**✅ Approve Consignment**:

- Product goes live in marketplace
- Farmer receives approval notification
- Inventory tracking begins
- Analytics tracking starts

**❌ Reject Consignment**:

- Provide rejection reason
- Suggest improvements
- Allow resubmission
- Notify farmer with feedback

**💰 Suggest Price**:

- Research market prices
- Provide suggested price
- Include reasoning/justification
- Start negotiation process

### Price Suggestion System

#### Creating Price Suggestions

1. **Market Research**:
   - Compare similar products
   - Check regional pricing
   - Consider seasonal factors
   - Analyze demand trends

2. **Suggestion Process**:
   - Enter suggested price
   - Provide market justification
   - Include comparison data
   - Send to farmer for review

3. **Negotiation Management**:
   - Track farmer responses
   - Handle counter-offers
   - Facilitate price discussions
   - Finalize agreed pricing

#### Price Analytics

- Average price suggestions
- Acceptance rates
- Negotiation success
- Market price trends

## 🚛 Driver Management

Access: **Admin Dashboard → Drivers**

### Driver Application Review

#### Application Process

1. **Document Verification**:
   - Driving license validation
   - Vehicle registration check
   - Insurance verification
   - Background check completion

2. **Approval Criteria**:
   - Valid documentation
   - Clean driving record
   - Appropriate vehicle type
   - Geographic coverage

#### Driver Performance Monitoring

**Performance Metrics**:

- On-time delivery percentage
- Customer satisfaction ratings
- Order completion rate
- Vehicle condition reports

**Quality Control**:

- Customer feedback review
- Performance trend analysis
- Issue resolution tracking
- Improvement recommendations

### Route Management

- Delivery zone assignments
- Route optimization
- Load balancing
- Coverage area management

## 🛒 Shop Management

Access: **Admin Dashboard → Shop**

### Product Management

#### Product Catalog

- View all approved products
- Manage product availability
- Update product information
- Monitor stock levels

#### Inventory Control

- Track stock quantities
- Set low stock alerts
- Manage product expiration
- Handle discontinued items

#### Featured Products

- Promote quality products
- Seasonal highlighting
- Farmer spotlights
- Marketing campaigns

### Order Management

#### Order Processing

- View all platform orders
- Track order status
- Manage delivery assignments
- Handle order modifications

#### Order Analytics

- Sales performance tracking
- Popular product analysis
- Customer behavior insights
- Revenue optimization

## 📊 Analytics & Reporting

Access: **Admin Dashboard → Analytics**

### Revenue Analytics

#### Financial Metrics

- **Total Revenue**: Platform-wide earnings
- **Daily Sales**: Current day performance
- **Monthly Trends**: Growth patterns
- **Payment Methods**: M-Pesa vs. cash statistics

#### Revenue Breakdown

- Subscription fees (farmer activation)
- Commission from sales
- Service fees
- Additional revenue streams

### User Analytics

#### User Growth

- New registrations over time
- User retention rates
- Geographic distribution
- Role-based growth patterns

#### Engagement Metrics

- Daily active users
- Session duration
- Feature usage
- Mobile vs. web usage

### Product Analytics

#### Best-Selling Products

- Top products by volume
- Revenue-generating items
- Seasonal trends
- Regional preferences

#### Farmer Performance

- Top-performing farmers
- Sales consistency
- Quality ratings
- Geographic distribution

### System Performance

- Platform uptime
- Response time metrics
- Error rate monitoring
- Mobile app performance

## ⚙️ System Settings

Access: **Admin Dashboard → Settings**

### General Configuration

#### Site Information

- Platform name and description
- Contact information
- Social media links
- Legal information

#### Regional Settings

- Supported counties
- Currency settings
- Language preferences
- Time zone configuration

### Payment Configuration

#### M-Pesa Settings

- Shortcode configuration
- Passkey management
- Callback URL setup
- Testing vs. production mode

#### Fee Structure

- Farmer activation fee (KES 300)
- Platform commission rates
- Delivery fees
- Payment processing fees

### Notification Settings

#### Email Notifications

- User registration confirmations
- Order status updates
- Payment confirmations
- System alerts

#### SMS Notifications

- M-Pesa payment updates
- Order delivery notifications
- Emergency alerts
- Marketing messages

### Security Settings

#### Access Control

- Admin role permissions
- Feature access restrictions
- IP-based restrictions
- Session timeout settings

#### Data Protection

- Privacy policy enforcement
- Data retention policies
- GDPR compliance
- Audit trail maintenance

## 🔧 System Maintenance

### Database Management

- User data cleanup
- Order history archival
- Performance optimization
- Backup verification

### Content Moderation

- Review user-generated content
- Moderate product descriptions
- Handle inappropriate content
- Maintain quality standards

### System Updates

- Platform version management
- Feature rollout control
- Bug fix deployment
- Security patch application

## 📈 Best Practices

### User Management

- **Regular Reviews**: Monitor user activity and account status
- **Prompt Support**: Respond quickly to user issues
- **Fair Enforcement**: Apply policies consistently
- **Growth Focus**: Foster platform growth and engagement

### Content Quality

- **High Standards**: Maintain quality product listings
- **Fair Pricing**: Ensure reasonable market pricing
- **Accurate Information**: Verify product descriptions
- **Visual Quality**: Encourage good product photos

### Performance Monitoring

- **Daily Metrics**: Review key performance indicators
- **Trend Analysis**: Identify growth patterns
- **Issue Resolution**: Address problems promptly
- **Continuous Improvement**: Implement user feedback

## 🆘 Troubleshooting

### Common Issues

#### Payment Problems

- **STK Push Failures**: Check M-Pesa configuration
- **Payment Status Delays**: Monitor callback responses
- **Duplicate Payments**: Implement proper validation

#### User Account Issues

- **Registration Problems**: Verify email/phone validation
- **Login Failures**: Check authentication settings
- **Permission Errors**: Review role-based access

#### System Performance

- **Slow Response Times**: Monitor server resources
- **High Error Rates**: Check application logs
- **Database Issues**: Monitor query performance

### Escalation Procedures

1. **Level 1**: Standard admin resolution
2. **Level 2**: Technical team involvement
3. **Level 3**: Developer/system administrator
4. **Level 4**: External vendor support

## 📞 Support & Resources

### Internal Support

- **Technical Team**: Development and maintenance
- **Customer Support**: User assistance
- **Business Team**: Strategic decisions

### External Resources

- **M-Pesa Support**: Payment integration issues
- **Hosting Provider**: Infrastructure support
- **Legal Counsel**: Compliance and regulatory

### Documentation

- **API Documentation**: Technical integration details
- **User Manuals**: End-user guidance
- **Process Guides**: Administrative procedures

---

🛡️ **Admin Power, Admin Responsibility**: Use these tools to build a thriving agricultural marketplace that benefits all stakeholders.
