FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html/basic
COPY  ./build /usr/share/nginx/html/basic
EXPOSE 80
# 启动nginx，关闭守护式运行，否则容器启动后会立刻关闭
CMD ["nginx", "-g", "daemon off;"]
