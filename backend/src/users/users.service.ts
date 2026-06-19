import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async create(data: { name: string; email: string; passwordHash?: string; googleId?: string; role?: Role; isEmailVerified?: boolean }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        googleId: data.googleId,
        role: data.role || 'customer',
        isEmailVerified: data.isEmailVerified || false,
      },
    });
  }

  async updateProfile(id: string, data: { name?: string; phone?: string; companyName?: string; gstin?: string; billingAddress?: string; shippingAddress?: string; profilePhoto?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        companyName: data.companyName,
        gstin: data.gstin,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        profilePhoto: data.profilePhoto,
      },
    });
  }

  async updateRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateDisabledStatus(id: string, isDisabled: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isDisabled },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
