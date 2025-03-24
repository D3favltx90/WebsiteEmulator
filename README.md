# Website Emulator

A modern, responsive website template with Docker and Nginx configuration for easy deployment. This project is a simple framework for creating websites for common web technologies so automated workflows can generate web traffic to season a virutal environment for testing, red teaming, and other security testing.

EchoTeck and DripMart are the first two websites that have been created which are simple examples. Additional sites will be added over time. 

## Project Structure

```
.
├── Dockerfile                   # Docker configuration
├── nginx.conf                   # Default Nginx configuration
├── EchoTeck/                    # Main project folder
│   ├── src/                     # Website source files
│   │   ├── index.html           # Home page
│   │   ├── about.html           # About page
│   │   ├── contact.html         # Contact page
│   │   ├── 404.html             # Error page
│   │   ├── style.css            # CSS styles
│   │   └── images/              # Image assets
│   └── nginx/                   
│       └── sites-available/     # Nginx site configuration
│           └── echoteck.net.conf # EchoTeck virtual host config
└── template/                    # Template files for custom sites
    └── nginx/                   
        └── sites-available/     
            └── template.com.conf # Template for Nginx virtual host config
```

## How to Start the Docker Container

1. Build the Docker image:
```bash
docker build -t website_emulator .
```

2. Run the container:
```bash
docker run -d -p 80:80 website_emulator
docker ps
# if any issues
docker ps -a # grab image id
docker logs [image_id]
```

3. Access the website:
   - Open your browser and navigate to http://localhost
   - If you're using a custom domain, replace `localhost` with your domain name.

## Creating a Custom Nginx Site Configuration

To create a custom site configuration using the template:

1. Create a new directory for your website:
```bash
mkdir -p MyWebsite/src
mkdir -p MyWebsite/nginx/sites-available
```

2. Copy the template configuration:
```bash
cp template/nginx/sites-available/template.com.conf MyWebsite/nginx/sites-available/mywebsite.com.conf
```

3. Edit the configuration file to match your domain and settings:
```bash
# Edit MyWebsite/nginx/sites-available/mywebsite.com.conf
# Change:
# - server_name from "template.com" to your domain name
# - root from "/usr/share/nginx/template" to your desired root path
```

4. Add your website content to the src directory:
```bash
# Copy your HTML, CSS, and other assets to MyWebsite/src/
```

5. Update the Dockerfile:
```dockerfile
# Update the following lines in the Dockerfile
COPY MyWebsite/src /usr/share/nginx/mywebsite
COPY MyWebsite/nginx/sites-available/mywebsite.com.conf /etc/nginx/sites-available/mywebsite.com.conf
RUN ln -s /etc/nginx/sites-available/mywebsite.com.conf /etc/nginx/sites-enabled/
```

6. Build and run your custom container:
```bash
docker build -t website_emulator .
docker run -d -p 80:80 website_emulator
```

## Example: Creating a Custom Site "MyBlog.com"

Here's a step-by-step example showing how to create a custom configuration for a blog website:

### 1. Create directory structure
```bash
mkdir -p MyBlog/src
mkdir -p MyBlog/nginx/sites-available
```

### 2. Copy and modify the template configuration
```bash
cp template/nginx/sites-available/template.com.conf MyBlog/nginx/sites-available/myblog.com.conf
```

### 3. Edit the configuration file (MyBlog/nginx/sites-available/myblog.com.conf):
```
server {
    listen 80;
    server_name myblog.com www.myblog.com;  # Changed domain name

    root /usr/share/nginx/myblog;  # Changed root directory
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;

    location = /404.html {
        internal;
    }
}
```

### 4. Update the Dockerfile:
```dockerfile
# Use an official Nginx runtime as a parent image
FROM nginx:latest

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the website content to the Nginx document root
COPY MyBlog/src /usr/share/nginx/myblog

# Copy a custom Nginx configuration
RUN mkdir -p /etc/nginx/sites-available/
RUN mkdir -p /etc/nginx/sites-enabled/
COPY MyBlog/nginx/sites-available/myblog.com.conf /etc/nginx/sites-available/myblog.com.conf
RUN ln -s /etc/nginx/sites-available/myblog.com.conf /etc/nginx/sites-enabled/

# Expose port 80 to the outside world
EXPOSE 80
```

### 5. Build and run:
```bash
docker build -t myblog .
docker run -d -p 80:80 myblog
```

## Additional Configuration Options

### SSL/HTTPS Configuration

To enable HTTPS with SSL certificates, modify your site configuration:

```
server {
    listen 80;
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/yourdomain.com.crt;
    ssl_certificate_key /etc/nginx/ssl/yourdomain.com.key;
    
    # ... rest of your configuration
}
```

### Custom Error Pages

You can customize error pages by adding:

```
error_page 500 502 503 504 /50x.html;
location = /50x.html {
    root /usr/share/nginx/html;
}
```

### Enabling Gzip Compression

For better performance, add:

```
gzip on;
gzip_types text/plain text/css application/javascript application/json;
gzip_min_length 1000;
```

## Troubleshooting

If you encounter issues:

1. Check Nginx logs:
```bash
docker exec -it [container_id] bash
cat /var/log/nginx/error.log
```

2. Validate Nginx configuration:
```bash
docker exec -it [container_id] nginx -t
```

3. Restart Nginx:
```bash
docker exec -it [container_id] nginx -s reload
``` 