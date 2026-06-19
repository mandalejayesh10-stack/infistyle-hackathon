import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: any) {
    const user = req.user;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      company_name: user.companyName || '',
      gstin: user.gstin || '',
      billing_address: user.billingAddress || '',
      shipping_address: user.shippingAddress || '',
      profile_photo: user.profilePhoto || '',
      is_email_verified: user.isEmailVerified,
    };
  }

  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() body: { name?: string; phone?: string; companyName?: string; gstin?: string; billingAddress?: string; shippingAddress?: string; profilePhoto?: string }
  ) {
    const updated = await this.usersService.updateProfile(req.user.id, body);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone || '',
      role: updated.role,
      company_name: updated.companyName || '',
      gstin: updated.gstin || '',
      billing_address: updated.billingAddress || '',
      shipping_address: updated.shippingAddress || '',
      profile_photo: updated.profilePhoto || '',
      is_email_verified: updated.isEmailVerified,
    };
  }
}
