<h1 align="center">
    <b>School Management System SasS</b>
    <br>
    
</h1>

<!-- docker build command -->

<!-- create docker image -->
sudo docker build --no-cache --progress plain -t school-admin:1.0 --network=host -f MehediDockerfile .

<!-- build container -->
docker run -d --name school -p 3000:3000 f1e64f13f077