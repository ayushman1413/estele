<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');
        $adminName = env('ADMIN_NAME', 'Admin');

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'is_admin' => true,
            ]
        );

        $customerEmail = env('CUSTOMER_EMAIL', 'customer@example.com');
        $customerPassword = env('CUSTOMER_PASSWORD', 'password');

        User::updateOrCreate(
            ['email' => $customerEmail],
            [
                'name' => env('CUSTOMER_NAME', 'Demo Customer'),
                'password' => Hash::make($customerPassword),
                'is_admin' => false,
            ]
        );
    }
}
