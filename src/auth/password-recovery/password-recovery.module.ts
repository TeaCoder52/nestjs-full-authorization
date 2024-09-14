import { Module } from '@nestjs/common'

import { MailService } from '@/libs/mail/mail.service'
import { UserService } from '@/user/user.service'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, UserService, MailService]
})
export class PasswordRecoveryModule {}
