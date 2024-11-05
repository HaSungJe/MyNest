// pm2 start ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'project_name',
            script: 'dist/src/main.js',
            args: '',
            env: {
                PORT: '3000'
            },
            watch: ['dist'],
            ignore_watch: ['node_modules'],
            exec_mode: 'cluster', // 클러스터 모드 사용
            instances: 'max', // 가능한 모든 CPU 코어 사용
            // max_memory_restart: '1G', // 메모리 사용 제한 설정
            autorestart: true // 자동 재시작 설정
        }
    ]
}