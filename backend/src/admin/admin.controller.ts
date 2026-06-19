import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  @Roles(Role.admin, Role.support)
  async listUsers() {
    const list = await this.usersService.findAll();
    return list.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      company_name: user.companyName || '',
      gstin: user.gstin || '',
      billing_address: user.billingAddress || '',
      shipping_address: user.shippingAddress || '',
      is_email_verified: user.isEmailVerified,
      is_disabled: user.isDisabled,
      created_at: user.createdAt,
    }));
  }

  @Patch('users/:id/role')
  @Roles(Role.admin)
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: Role }
  ) {
    const updated = await this.usersService.updateRole(id, body.role);
    return {
      id: updated.id,
      role: updated.role,
    };
  }

  @Patch('users/:id/status')
  @Roles(Role.admin)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { is_disabled: boolean }
  ) {
    const updated = await this.usersService.updateDisabledStatus(id, body.is_disabled);
    return {
      id: updated.id,
      is_disabled: updated.isDisabled,
    };
  }
}
