import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/user.service';
import { UserRole } from '../modules/user/user.schema';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Check if super admin already exists
    const existingSuperAdmin = await userService.findByRole(UserRole.SUPER_ADMIN);
    
    if (existingSuperAdmin && existingSuperAdmin.length > 0) {
      console.log('Super admin already exists');
    } else {
      // Create super admin user
      const password = 'SuperAdmin@123'; // This should be changed immediately after first login
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const superAdmin = await userService.create({
        email: 'super.admin@sea-faj.com',
        password: hashedPassword,
        userId: await userService.generateUniqueUserId(),
        role: UserRole.SUPER_ADMIN,
        isEmailVerified: true, // Super admin is pre-verified
      });
      
      console.log('Super admin created successfully:', superAdmin.email);
      console.log('Please change the default password after first login');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
